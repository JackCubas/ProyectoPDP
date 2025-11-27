const URLSERVERdetail = "http://localhost:3000/pdfs/";
const URLSERVERretrieve = "http://localhost:3000/retrieve/";

var thisDocName = "";

async function returnData() {

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    console.log("return data");
    return fetch(URLSERVERdetail + idHTML)
        .then((response) => { 
            return response.json().then((data) => {
                thisDocName = data[0].DocName;
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

async function retrievePDF() {

    console.log("retrieve pdf: " + URLSERVERretrieve + thisDocName);
    return fetch(URLSERVERretrieve + thisDocName, {
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
    const URLSERVERmodifypdf = "http://localhost:3000/modify-pdf/";

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    var projectName = document.getElementById("name").value;
    var file = document.getElementById("file").files[0];
    var docEstado = document.getElementById("docEstado").value;

    var formData = new FormData();
    formData.append("filename", projectName);
    formData.append("estado", docEstado);
    formData.append("uploadedFile", file);
    formData.append("userId", 2);

    console.log(formData);
    alert("prueba");


    /*const apiCall = await fetch(URLSERVERmodifypdf + idHTML, {
        method: "PUT",
        headers: {
            "Accept": "application/json"
        },
        body: formData,
    }
    );

    const result = await apiCall.json();
    console.log(result);*/

    window.location.href = "table.html";

}