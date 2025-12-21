const URLSERVERCreate = "http://localhost:3000/users";

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario.rolUser != "ADMIN"){
    window.location.href = "../404.html";
}

//create.html?prodId=34&price=34&quantity=34
//?prodId=34&price=34&quantity=34
var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "table_pag.html?page=1";
}

async function sendData(){

    //event.preventDefault();

    returnToTable = true;

    var nameUser = document.getElementById("nameUser").value;
    var emailUser = document.getElementById("emailUser").value;
    var passUser = document.getElementById("passUser").value;
    var rolUser = document.getElementById("rolUser").value;
    var encryptKeyUser = document.getElementById("encryptKeyUser").value;

    const nuevoUsers = {
        nameUser: nameUser,
        emailUser: emailUser,
        passUser: passUser,
        rolUser: rolUser,
        encryptKeyUser: encryptKeyUser
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

    window.location.href = "table_pag.html?page=1";
}
