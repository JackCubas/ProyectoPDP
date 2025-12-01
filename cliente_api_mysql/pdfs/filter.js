const URLSERVERpdfcriteria = "http://localhost:3000/pdfsByCriteria";
var thisDocName = "";

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
    var con=document.getElementById("main-container");
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
        f.textContent="User Name: " + data[i].nameUser                      
        con.appendChild(f);

        var g=document.createElement("div")
        g.textContent="User Email: " + data[i].emailUser                      
        con.appendChild(g);

        var h=document.createElement("div")
        h.textContent="Estado: " + data[i].estado                      
        con.appendChild(h);
    }
    console.log("finalizado generacion de ventana");
    alert("final");
}

/*

var emailUser = req.query.emailUser || "";
  var nameUser = req.query.nameUser || "";
  var docName = req.query.docName || "";
  var estado = req.query.estado || "";

*/