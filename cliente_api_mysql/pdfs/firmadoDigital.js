const URLSERVERFirmadoDigital = "http://localhost:3000/firmadoDigital/";
const URLSERVERdetailOriginal = "http://localhost:3000/pdfs/";

const URLSERVERretrieve = "http://localhost:3000/retrieve/";
const URLSERVERdetailPDF = "http://localhost:3000/pdfStamp/";

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

var thisDocName = "";
var userId = null;
var initialTimestampName = "";

var URLString = window.location.href.split('?');
var datosURL = URLString[1].split('&');
var idHTML = datosURL[0].replace("id=","");
var pageHTML = datosURL[1].replace("page=","");

function checkUserHosting(){

    var buttons = document.getElementById("button-container");
    var button = document.createElement("button");
    button.innerHTML = "Cancel";
    button.onclick = onbuttonclicked;
    buttons.appendChild(button);
}

function onbuttonclicked() {
  //"location.href='table_pag.html?page=' + pageHTML";
  if (onbuttonclicked) {
    window.location.href = "table.html?page=" + pageHTML;
  }
}

async function sendData(){

    const fdUser = {
        fdUserId: datosUsuario.id,
    }

    return fetch(URLSERVERFirmadoDigital + idHTML, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(fdUser)
    })
    .then((response) => { 
        console.log(response);

        if(response.status === 400 || response.status === 500){
            alert("No se ha podido hacer firmado digital");
            window.location.href = "table.html?page=" + pageHTML;
        }else{

            alert("Se ha podido hacer firmado digital");
            window.location.href = "table.html?page=" + pageHTML;
        } 

    });

}

checkUserHosting()