var backendUrl = "";
var URLSERVERStamp = "";
var URLSERVERdetail = "";
var URLSERVERretrieve = "";

/*var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "table.html";
}*/

var datosUsuario = null;

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario.rolUser != "ADMIN" && datosUsuario.rolUser != "FIRMA"){
    window.location.href = "../404.html";
}

if(localStorage !== null && localStorage.getItem("backendUrl") !== null){
    backendUrl = localStorage.getItem("backendUrl");
    URLSERVERStamp = backendUrl + "/stamp/";
    URLSERVERdetail = backendUrl + "/pdfs/";
    URLSERVERretrieve = backendUrl + "/retrieve/";

    //const URLSERVERStamp = "http://localhost:3000/stamp/";
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

async function returnDataOriginal() {

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

                return appendDataOriginal(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

async function retrievePDF() {

    console.log("retrieve pdf: " + URLSERVERretrieve + thisDocName + "/" + userId + "/" + initialTimestampName + "/" + "STAMP");
    return fetch(URLSERVERretrieve + thisDocName + "/" + userId + "/" + initialTimestampName + "/" + "STAMP", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => { 
        console.log(response);

        return response.blob().then((data) => {
                    //console.log(data);
                    return generateWindow(data);
                }).catch((err) => {
                    console.log(err);
                }) 

    });
    

}

//pdfs.id as pdfId, pdfs.name AS DocName, urlCarpeta, nameUser, userId
function appendDataOriginal(data){
    for(let i=0;i<data.length;i++){
        console.log(data[i]);

        thisDocName = data[i].DocName;                     

        var initialTimestampNameAux = data[0].initialUploadTimestamp.slice(0, 19).replace('T', ' ');
        var initialTimestampNameAux2 = initialTimestampNameAux.replace(" ","_").replaceAll(":","-");
        initialTimestampName = initialTimestampNameAux2.replaceAll("-","_");

    }
    console.log("finalizado generacion de ventana");
}

async function returnDataStamp() {
    const URLSERVERdetail = backendUrl + "/pdfStamp/";

    //const URLSERVERdetail = "http://localhost:3000/pdfStamp/";
    //var datosURL = window.location.href.split('?');
    //var idHTML = datosURL[1].replace("id=","");

    //console.log("return data");
    return fetch(URLSERVERdetail + idHTML)
        .then((response) => { 
            return response.json().then((data) => {
                return appendDataStamp(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

function appendDataStamp(data){

    var buttons = document.getElementById("button-container");

    var buttonSub = document.createElement("button");
    buttonSub.innerHTML = "Guardar";
    buttonSub.id = "submit";
    buttonSub.onclick = sendData;
    buttons.appendChild(buttonSub);
    
    var buttonDel = document.createElement("button");
    buttonDel.innerHTML = "Eliminar";
    buttonDel.id = "delete";
    buttonDel.onclick =  deleteDocument;
    buttons.appendChild(buttonDel);

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

    var con=document.getElementById("main-container");
    if(data.length !== 0){
        
        for(let i=0;i<data.length;i++){
            console.log(data[i]);

            var d=document.createElement("div");
            d.textContent="Doc Name: " + data[i].DocName;
            thisDocName = data[i].DocName;                     
            con.appendChild(d);

            var e=document.createElement("div")
            e.textContent="Doc URL: " + data[i].urlCarpeta                      
            con.appendChild(e);

            var f=document.createElement("div")
            f.textContent="Nombre de usuario del estampado: " + data[i].nameUser                      
            con.appendChild(f);

            var g=document.createElement("div")
            g.textContent="Estado: " + data[i].estado                      
            con.appendChild(g);

            var h=document.createElement("div");

            var initialTimestampNameAux = data[0].initialUploadTimestamp.slice(0, 19).replace('T', ' ');
            var initialTimestampNameAux2 = initialTimestampNameAux.replace(" ","_").replaceAll(":","-");
            initialTimestampName = initialTimestampNameAux2.replaceAll("-","_");

            h.textContent="Fecha y hora de creación: " + initialTimestampNameAux;                      
            con.appendChild(h);

            var k=document.createElement("div");
            var stampTimestampNameAux = data[0].stampTimestamp.slice(0, 19).replace('T', ' ');
            k.textContent="Fecha y hora del estampado: " + stampTimestampNameAux;                      
            con.appendChild(k);

            document.getElementById("timeStampCheck").disabled = true;
            document.getElementById("submit").disabled = true;

        }
    }else{
        console.log("No hay documento estampado");

        var j=document.createElement("div");
        j.textContent="No hay documento estampado";
        con.appendChild(j);

        setElementVisibility("submit", false);
        setElementVisibility("delete", false);
    }
    //console.log("finalizado generacion de ventana");
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
    console.log(response);

    const fileURL = URL.createObjectURL(response);
    console.log(fileURL);
    window.open(fileURL);

}

function checkUserHosting(){

    //var idHTML = null;
    //var datosURL = window.location.href.split('?');
    //idHTML = datosURL[1].replace("id=","");

    if(idHTML === null || idHTML === ""){
        window.location.href = "table.html?page=1";
    }else{

        returnDataOriginal().then(() => {
            returnDataStamp();
        }).then(() => {
            retrievePDF();
        })
    }
    
}

checkUserHosting();

async function sendData(){

    //var datosURL = window.location.href.split('?');
    //var idHTML = datosURL[1].replace("id=","");

    var checkbox = document.getElementById('timeStampCheck');

    //alert(checkbox.checked);

    const modUser = {
        filename: thisDocName,
        initialTimestampName: initialTimestampName,
        originalUserId: userId,
        stampUserId: datosUsuario.id,
        addTimeStamp: checkbox.checked
    }

    /*const apiCall = await fetch(URLSERVERStamp + idHTML, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(modUser)
    }
    );

    const result = await apiCall.json();
    console.log(result);*/

    return fetch(URLSERVERStamp + idHTML, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(modUser)
    })
    .then((response) => { 
        console.log(response);

        if(response.status === 400 || response.status === 500){
            modalAlert("No se ha podido crear documento estampado", function() {
                window.location.href = "table.html?page=" + pageHTML;
            });
            console.error("No se ha podido crear documento estampado");
        }else{
            modalAlert("Se ha podido crear documento estampado", function() {
                window.location.href = "table.html?page=" + pageHTML;
            });
            console.info("Se ha podido crear documento estampado");

            /*return response.blob().then((data) => {
                console.log(data);
                return generateWindow(data);
            }).catch((err) => {
                console.log(err);
            })*/
        } 


    });

}

async function deleteDocument(){
    //alert("delete document");

    const URLSERVERDelete = backendUrl + "/eliminateDocStamp";

    //const URLSERVERDelete = "http://localhost:3000/eliminateDocStamp";
    //var datosURL = window.location.href.split('?');
    //var idHTML = datosURL[1].replace("id=","");

    const response = await fetch(URLSERVERDelete + '?id=' + idHTML + '&docName=' + thisDocName + '&userId=' + userId + '&initialTimestampName=' + initialTimestampName, {
        method: "DELETE"
    })

    const result = await response.json();
    console.log(result);

    if(result.status === 400 || result.status === 500 || result.hasOwnProperty("error")){
        modalAlert("No se ha podido borrar documento estampado", function() {
            window.location.href = "table.html?page=" + pageHTML;
        });
        console.error("No se ha podido borrar documento estampado");
    }else{
        console.info("Documento estampado borrado correctamente");
        modalAlert("Documento estampado borrado correctamente", function() {
            window.location.href = "table.html?page=" + pageHTML;
        });
    }
}