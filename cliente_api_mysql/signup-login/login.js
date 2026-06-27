var URLSERVERlogin = "";
if(localStorage !== null && localStorage.getItem("backendUrl") !== null){
    const backendUrl = localStorage.getItem("backendUrl");
    URLSERVERlogin = backendUrl + "/login";

    //const URLSERVERlogin = "http://localhost:3000/login";
}

var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "../index.html";
}

console.log("Entrando en el login");

function checkUserHosting() {
    var buttons = document.getElementById("button-container");

    var buttonSub = document.createElement("button");
    buttonSub.innerHTML = "Iniciar sesión";
    buttonSub.onclick = sendData;
    buttons.appendChild(buttonSub);
}

function isValidName(str) {
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 _-]+$/;
  return regex.test(str);
}

async function sendData(){

    const emailPattern = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

    var emailUser = document.getElementById("emailUser").value;
    var passUser = document.getElementById("passUser").value;

     if(emailUser === "" || passUser === ""){
        modalAlert("Todos los campos son obligatorios.");
        console.error("Todos los campos son obligatorios.");

    }else if(!emailPattern.test(emailUser)){
        modalAlert('No es un correo electronico adecuado');
        console.error('No es un correo electrónico adecuado');

        document.getElementById("emailUser").focus();
        document.getElementById("emailUser").value = "";

    }else if(!isValidName(nameUser)){
        modalAlert('No se permiten caracteres prohibidos al nombre.');
        console.error("No se permiten caracteres prohibidos al nombre.");

        document.getElementById("nameUser").focus();
        document.getElementById("nameUser").value = "";
    
    }else if (passUser.length>50){
        modalAlert("El pass debe tener menos de 51 caracteres.");
        console.error("La contraseña debe tener menos de 51 caracteres.");

		document.getElementById("passUser").focus();
        document.getElementById("passUserRepeat").focus();

        document.getElementById("passUser").value = "";
        document.getElementById("passUserRepeat").value = "";

    }else if (passUser.length<6){ 
        modalAlert("El pass debe tener al menos 6 caracteres.");
        console.error("La contraseña debe tener al menos 6 caracteres.");

		document.getElementById("passUser").focus();
        document.getElementById("passUserRepeat").focus();

        document.getElementById("passUser").value = "";
        document.getElementById("passUserRepeat").value = "";   

    }else{

        var emailCrypt = CryptoJS.AES.encrypt(emailUser, "firma_app").toString();
        var passCrypt = CryptoJS.AES.encrypt(passUser, "firma_app").toString();

        //?color1=red&color2=blue

        //const apiCall = await fetch(URLSERVERlogin + '?email=' + emailUser + '&pass=' + passUser)
        //const result = await apiCall.json();
        //console.log(apiCall);
        //console.log(result);
        //alert("response");

        const loginUsers = {
            userEmail: emailCrypt,
            userPass: passCrypt,
        }
        
        return fetch(URLSERVERlogin, {
            //method: "GET",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(loginUsers)
        })
        .then((response) => {

            if(!response.ok){
                modalAlert("No se ha podido encontrar usuario");
                console.error("No se ha podido encontrar usuario");
            }else{

                if(response.status === 400 || response.status === 500 || response.status === 204){
                    modalAlert("No se ha podido encontrar usuario");
                    console.error("No se ha podido encontrar usuario");
                        //window.location.href = "../index.html";
                }else{
                    return response.json().then((data) => {
                        return checkData(data);
                    }).catch((err) => {
                        console.log(err);
                    })           
                }
            } 

        })
        .catch((error) => {
        modalAlert("Server is down");
        console.error('Error:', error);
        console.error("El servidor no responde");   
        });
    
    }
}

function checkData(data){
    var userDatos = data.user[0];
    console.log(userDatos)
    if(userDatos == "FALSE"){
        modalAlert("Usuario no existe");
        console.error("El usuario no existe");
        console.log("Usuario no existe");
        localStorage.setItem("usuario", "FALSE");
    }else{
        if(userDatos.rolUser == "ADMIN"){
            modalAlert("ADMIN");
            console.log("Usuario ADMIN");
            console.log("Usuario ADMIN");
            localStorage.setItem("usuario", JSON.stringify(userDatos));
        }
        if(userDatos.rolUser == "CLIENT"){
            modalAlert("CLIENT");
            console.log("Usuario CLIENT");
            console.log("Usuario CLIENT");
            localStorage.setItem("usuario", JSON.stringify(userDatos));
        }
        if(userDatos.rolUser == "FIRMA"){
            modalAlert("FIRMA");
            console.log("Usuario FIRMA");
            console.log("Usuario FIRMA");
            localStorage.setItem("usuario", JSON.stringify(userDatos));
        }
    }

    console.log(JSON.parse(localStorage.getItem("usuario")));
    //alert("response"); 
    //localStorage.clear();
    window.location.href = "../index.html";
}

checkUserHosting();
