const URLSERVERCreate = "http://localhost:3000/users";

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

    await fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoUsers)
    })

    window.location.href = "table_pag.html?page=1";
}
