const URLSERVERpdfcriteria = "http://localhost:3000/pdfsByCriteria";

/*var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "../index.html";
}*/

async function sendData(){


    var emailUser = document.getElementById("emailUser").value;
    var nameUser = document.getElementById("nameUser").value;
    var docName = document.getElementById("docName").value;
    var estado = document.getElementById("estado").value;

    //?color1=red&color2=blue

    const apiCall = await fetch(URLSERVERpdfcriteria + '?emailUser=' + emailUser + '&nameUser=' + nameUser + '&docName=' + docName + '&estado=' + estado)
    const result = await apiCall.json();
    //console.log(apiCall);
    //console.log(result);
    //alert("response"); 
    checkData(result)    
}

function checkData(data){
    for (let i = 0; i < data.length; i++) {
    console.log(data[i]);
    }
}

/*

var emailUser = req.query.emailUser || "";
  var nameUser = req.query.nameUser || "";
  var docName = req.query.docName || "";
  var estado = req.query.estado || "";

*/