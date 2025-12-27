const URLSERVERlogin = "http://localhost:3000/login";

var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "../index.html";
}

console.log("Entrando en el login");

function checkUserHosting() {
    var buttons = document.getElementById("button-container");

    var buttonSub = document.createElement("button");
    buttonSub.innerHTML = "Submit";
    buttonSub.onclick = sendData;
    buttons.appendChild(buttonSub);
}

async function sendData(){


    var emailUser = document.getElementById("emailUser").value;
    var passUser = document.getElementById("passUser").value;
    //?color1=red&color2=blue

    //const apiCall = await fetch(URLSERVERlogin + '?email=' + emailUser + '&pass=' + passUser)
    //const result = await apiCall.json();
    //console.log(apiCall);
    //console.log(result);
    //alert("response");
    
    return fetch(URLSERVERlogin + '?email=' + emailUser + '&pass=' + passUser, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    })
    .then((response) => {

        if(response.status === 400 || response.status === 500 || response.status === 204){
            alert("No se ha podido encontrar usuario");
                //window.location.href = "../index.html";
        }else{
            return response.json().then((data) => {
                return checkData(data);
            }).catch((err) => {
                console.log(err);
            })           
        } 

    });
   
}

function checkData(data){
    var userDatos = data.user[0];
    console.log(userDatos)
    if(userDatos == "FALSE"){
        alert("FALSE");
        console.log("Usuario no existe");
        localStorage.setItem("usuario", "FALSE");
    }else{
        if(userDatos.rolUser == "ADMIN"){
            alert("ADMIN");
            console.log("Usuario ADMIN");
            localStorage.setItem("usuario", JSON.stringify(userDatos));
        }
        if(userDatos.rolUser == "CLIENT"){
            alert("CLIENT");
            console.log("Usuario CLIENT");
            localStorage.setItem("usuario", JSON.stringify(userDatos));
        }
        if(userDatos.rolUser == "FIRMA"){
            alert("FIRMA");
            console.log("Usuario FIRMA");
            localStorage.setItem("usuario", JSON.stringify(userDatos));
        }
    }

    console.log(JSON.parse(localStorage.getItem("usuario")));
    alert("response"); 
    //localStorage.clear();
    window.location.href = "../index.html";
}

checkUserHosting();
