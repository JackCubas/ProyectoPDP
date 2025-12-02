const URLSERVERpdfcriteria = "http://localhost:3000/pdfsByCriteria";
var emailUser = "";
var nameUser = "";
var docName = "";
var estado = "";

/*var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "../index.html";
}*/

async function sendData(){

    emailUser = document.getElementById("emailUser").value;
    nameUser = document.getElementById("nameUser").value;
    docName = document.getElementById("docName").value;
    estado = document.getElementById("estado").value;

    //?color1=red&color2=blue

    return fetch(URLSERVERpdfcriteria + '?emailUser=' + emailUser + '&nameUser=' + nameUser + '&docName=' + docName + '&estado=' + estado)
    .then((response) => { 
            return response.json().then((data) => {
                //return appendData(data);
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });    
}

function appendData(data){
    console.log(data);

    let parent = document.getElementById("mytable").getElementsByTagName('tbody')[0];
    empty(parent);

    const table = document.getElementById("mytable").getElementsByTagName('tbody')[0];

    for(let i=0;i<data.length;i++){
        console.log(data[i]);

        const newRow = table.insertRow();

        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);

        cell1.innerText = data[i].DocName;
        cell2.innerText = data[i].nameUser;
        cell3.innerText = data[i].estado;
    }

    var form = document.getElementById("form"); 
    function handleForm(event) {     
        event.preventDefault(); 
    }  
    form.addEventListener('submit', handleForm);
    
    console.log("finalizado generacion de ventana");
    //alert("final");
}


function checkUserHosting() {
    return fetch(URLSERVERpdfcriteria + '?emailUser=' + emailUser + '&nameUser=' + nameUser + '&docName=' + docName + '&estado=' + estado)
        .then((response) => { 
            return response.json().then((data) => {
                //return appendData(data);
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}


checkUserHosting();

function empty(element) {
  while(element.firstElementChild) {
     element.firstElementChild.remove();
  }
}

/*

var emailUser = req.query.emailUser || "";
  var nameUser = req.query.nameUser || "";
  var docName = req.query.docName || "";
  var estado = req.query.estado || "";

*/