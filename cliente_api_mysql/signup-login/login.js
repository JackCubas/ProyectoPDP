const URLSERVERlogin = "http://localhost:3000/login";

var datosURL = window.location.href;

//if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
//    window.location.href = "../index.html";
//}

console.log("Entrando en el login");

async function sendData(){


    var emailUser = document.getElementById("emailUser").value;
    var passUser = document.getElementById("passUser").value;
    //?color1=red&color2=blue

    const apiCall = await fetch(URLSERVERlogin + '?email=' + emailUser + '&pass=' + passUser)
    const result = await apiCall.json();
    //console.log(apiCall);
    //console.log(result);
    //alert("response"); 
    checkData(result)    
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
    //window.location.href = "../index.html";
}
