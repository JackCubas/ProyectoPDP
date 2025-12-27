const URLSERVERCreate = "http://localhost:3000/users";
const URLSERVERCount = "http://localhost:3000/countUsers";

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario.rolUser != "ADMIN"){
    window.location.href = "../404.html";
}

var datosURL = window.location.href;

/*if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "table_pag.html?page=1";
}*/

var pageHTML = "1";
var newHTML = 1;

var datosURL = window.location.href.split('?');
var pageHTML = datosURL[1].replace("page=","");

function checkUserHosting() {

    return fetch(URLSERVERCount)
        .then((response) => { 
            return response.json().then((data) => {
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

function appendData(data){
    //console.log("Numero total de usuarios: ");
    //console.log(data);
    var totalUsuarios = data[0].total;
    var usuariosDeci = totalUsuarios/10;

    console.log("Numero total de usuarios: " + totalUsuarios);

    if(!Number.isInteger(usuariosDeci)){
        //pageHTML = Math.ceil(totalUsuarios/10);
        newHTML = Math.ceil(totalUsuarios/10);
    }

    if(Number.isInteger(usuariosDeci) && usuariosDeci > 1){
        //pageHTML = Math.ceil(totalUsuarios/10);
        newHTML = Math.ceil(totalUsuarios/10) + 1;
    }

    console.log("Current page: " + pageHTML);
    console.log("New page: " + newHTML);

    var buttons = document.getElementById("button-container");

    var buttonSub = document.createElement("button");
    buttonSub.innerHTML = "Submit";
    buttonSub.onclick = sendData;
    buttons.appendChild(buttonSub);  

    var buttonCan = document.createElement("button");
    buttonCan.innerHTML = "Cancel";
    buttonCan.onclick = onbuttonclicked;
    buttons.appendChild(buttonCan);  
}

function onbuttonclicked() {
  //"location.href='table_pag.html?page=' + pageHTML";
  if (onbuttonclicked) {
    window.location.href = "table_pag.html?page=" + pageHTML;
  }
}

async function sendData(){

    //event.preventDefault();

    returnToTable = true;

    var nameUser = document.getElementById("nameUser").value;
    var emailUser = document.getElementById("emailUser").value;
    var passUser = document.getElementById("passUser").value;
    var rolUser = document.getElementById("rolUser").value;
    var dniUser = document.getElementById("dniUser").value;

    const nuevoUsers = {
        nameUser: nameUser,
        emailUser: emailUser,
        passUser: passUser,
        rolUser: rolUser,
        dniUser: dniUser
    }

    const apiCall = await fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoUsers)
    })

    const result = await apiCall.json();
    console.log(result);

    //alert("prueba");

    window.location.href = "table_pag.html?page=" + newHTML;
}

 checkUserHosting()
