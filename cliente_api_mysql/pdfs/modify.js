var backendUrl = "";
var URLSERVERdetail = "";
var URLSERVERretrieve = "";

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

var datosUsuario = null;

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(localStorage !== null && localStorage.getItem("backendUrl") !== null){
    backendUrl = localStorage.getItem("backendUrl");
    URLSERVERdetail = backendUrl + "/pdfs/";
    URLSERVERretrieve = backendUrl + "/retrieve/";

    //const URLSERVERdetail = "http://localhost:3000/pdfs/";
    //const URLSERVERretrieve = "http://localhost:3000/retrieve/";
}

var thisDocName = "";
var userId = null;
var initialTimestampName = "";

var URLString = window.location.href.split('?');
var datosURL = URLString[1].split('&');
var idHTML = datosURL[0].replace("id=","");

/*if(idHTML === "" || isNaN(idHTML)){
    window.location.href = 'table_pag.html?page=1';
}*/

var pageHTML = datosURL[1].replace("page=","");

var filterTrue = "";

if (datosURL.length > 2 && typeof datosURL[2] !== 'undefined' && datosURL[2] !== '' && datosURL[2].includes('true')) {
    filterTrue = true;
}

async function returnData() {

    //var datosURL = window.location.href.split('?');
    //var idHTML = datosURL[1].replace("id=","");

    console.log("return data");
    return fetch(URLSERVERdetail + idHTML)
        .then((response) => { 
            return response.json().then((data) => {
                thisDocName = data[0].DocName;
                userId = data[0].userId;

                var initialTimestampNameAux = data[0].initialUploadTimestamp.slice(0, 19).replace('T', ' ');
                var initialTimestampNameAux2 = initialTimestampNameAux.replace(" ","_").replaceAll(":","-");
                initialTimestampName = initialTimestampNameAux2.replaceAll("-","_");

                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

async function retrievePDF() {

    console.log("retrieve pdf: " + URLSERVERretrieve + thisDocName + "/" + userId + "/" + initialTimestampName + "/" + "ORIGINAL");
    return fetch(URLSERVERretrieve + thisDocName + "/" + userId + "/" + initialTimestampName + "/" + "ORIGINAL", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => { 
        console.log(response);
        return response.blob().then((data) => {
                    console.log(data);
                    return generateWindow(data);
                }).catch((err) => {
                    console.log(err);
                }) 


    });
    

}

//pdfs.id as pdfId, pdfs.name AS DocName, urlCarpeta, nameUser, userId
function appendData(data){
    if(data && data.length != 0){
        document.getElementById("name").value = data[0].DocName;
        document.getElementById("docEstado").value = data[0].estado;
    }
    
    var buttons = document.getElementById("button-container");

    var buttonSub = document.createElement("button");
    buttonSub.innerHTML = "Guardar cambios";
    buttonSub.onclick = sendData;
    buttons.appendChild(buttonSub);
    
    if(filterTrue === true){
        var buttonFilter = document.createElement("button");
        buttonFilter.innerHTML = "Regresar a filtro";
        buttonFilter.onclick = onbuttonclickedFiltro;
        buttons.appendChild(buttonFilter);
    }

    var buttonCan = document.createElement("button");
    buttonCan.innerHTML = "Cancelar";
    buttonCan.onclick = onbuttonclicked;
    buttons.appendChild(buttonCan); 

    if(datosUsuario.rolUser !== "ADMIN"){
        document.getElementById("docEstado").disabled = true;
    }
}

function onbuttonclicked() {
  //"location.href='table_pag.html?page=' + pageHTML";
  if (onbuttonclicked) {
    window.location.href = "table.html?page=" + pageHTML;
  }
}

function onbuttonclickedFiltro() {
  if (onbuttonclickedFiltro) {
    history.back();
  }
}

function generateWindow(response){

    const fileURL = URL.createObjectURL(response);
    console.log(fileURL);
    window.open(fileURL); 
}

function checkUserHosting(){
    returnData().then(() => {
        retrievePDF();
    })
    
}

checkUserHosting();

async function sendData(){
    const URLSERVERmodifypdf = backendUrl + "/modify-pdf/";

    //const URLSERVERmodifypdf = "http://localhost:3000/modify-pdf/";
    //var datosURL = window.location.href.split('?');
    //var idHTML = datosURL[1].replace("id=","");

    var projectName = document.getElementById("name").value;
    var file = document.getElementById("file").files[0];
    var docEstado = document.getElementById("docEstado").value;

    var fileInput = document.getElementById('file');	
    var filePath = fileInput.value;
    var allowedExtensions = /(\.pdf)$/i;

    console.log("filename: " + projectName + " filenameOriginal: " + thisDocName + " estado: " + docEstado + " uploadedFile: " + file);

    if (file !== undefined && file !== null && !allowedExtensions.exec(filePath)) {
        modalAlert('Tipo de archivo no válido');
        console.error('Tipo de archivo no válido');
        fileInput.value = '';
        return false;
    
    }else{

        if(projectName === ""){
            modalAlert('El nombre del proyecto es obligatorio.');
            console.error("Todos los campos son obligatorios.");

        }else if(projectName.length>50){
            modalAlert('El nombre del proyecto debe tener menos de 51 caracteres.');
            console.error("El nombre debe tener menos de 51 caracteres.");

		    document.getElementById("name").focus();
            document.getElementById("name").value = "";
        }else{
         
            if(file === undefined){
                file = null;
            }

            console.log("filename2: " + projectName + " filenameOriginal: " + thisDocName + " estado2: " + docEstado + " uploadedFile2: " + file);

            var formData = new FormData();
            formData.append("filename", projectName);
            formData.append("filenameOriginal", thisDocName);
            formData.append("initialTimestampName", initialTimestampName);
            formData.append("estado", docEstado);
            formData.append("uploadedFile", file);
            formData.append("userIdOriginal", userId);
            formData.append("userIdNuevo", datosUsuario.id);
            //formData.append("userIdNuevo", 1);

            //alert("prueba");


            const apiCall = await fetch(URLSERVERmodifypdf + idHTML, {
                method: "PUT",
                headers: {
                    "Accept": "application/json"
                },
                body: formData,
            }
            );

            const result = await apiCall.json();
            console.log(result);

            if(result.status === 400 || result.status === 500 || result.hasOwnProperty("error")){
                modalAlert("No se ha podido modificar documento", function() {
                    window.location.href = "table.html?page=" + pageHTML;
                });
                console.error("No se ha podido modificar documento");
            }else{
                //console.log(response);
                modalAlert("Documento modificado correctamente", function() {
                    window.location.href = "table.html?page=" + pageHTML;
                });
                console.info("Documento modificado correctamente");      
            }
        }

        //window.location.href = "table.html?page=" + pageHTML;

    }
}