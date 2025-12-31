const URLSERVERCreate = "http://localhost:3000/users";

//create.html?prodId=34&price=34&quantity=34
//?prodId=34&price=34&quantity=34
var datosURL = window.location.href;

if(datosURL.includes("?")){
    //alert(datosURL);
    var datosURLSplit = window.location.href.split('?');
    var datosURLNuevo = datosURLSplit[0];

    //window.history.replaceState( {} , '', datosURLNuevo);
    window.location.href = datosURLNuevo;
}

function checkUserHosting() {
    var buttons = document.getElementById("button-container");

    var buttonSub = document.createElement("button");
    buttonSub.innerHTML = "Submit";
    buttonSub.onclick = sendData;
    buttons.appendChild(buttonSub);
}

async function sendData(){

    //event.preventDefault();

    var nameUser = document.getElementById("nameUser").value;
    var emailUser = document.getElementById("emailUser").value;
    var passUser = document.getElementById("passUser").value;
    var passUserRepeat = document.getElementById("passUserRepeat").value;
    var dniUser = document.getElementById("dniUser").value;
    var rolUser = document.getElementById("rolUser").value;

    if (passUser !== passUserRepeat) {
        alert('Ambos pass necesitan ser iguales');
        document.getElementById("passUser").value = "";
        document.getElementById("passUserRepeat").value = "";

        //event.stopPropagation();

        //return false;
    }else{
        const emailPattern = /^\S+@\S+\.\S+$/
        if(!emailPattern.test(emailUser)){
            alert('No es un correo electronico adecuado');
            document.getElementById("emailUser").value = "";

            //event.stopPropagation();

            //return false;
        }else{
            
            var emailCrypt = CryptoJS.AES.encrypt(emailUser, "firma_app").toString();
            var passCrypt = CryptoJS.AES.encrypt(passUser, "firma_app").toString();
            var dniCrypt = CryptoJS.AES.encrypt(dniUser, "firma_app").toString();

            const nuevoUsers = {
                nameUser: nameUser,
                emailUser: emailCrypt,
                passUser: passCrypt,
                dniUser: dniCrypt,
                rolUser: rolUser
            }

            /*const apiCall = await fetch(URLSERVERCreate, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(nuevoUsers)
            })

            const result = await apiCall.json();
            console.log(result);

            alert("SignUp hecho correctamente");

            window.location.href = "../index.html";*/

            return fetch(URLSERVERCreate, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(nuevoUsers)
            })
            .then((response) => { 
                console.log(response);

                if(response.status === 400 || response.status === 500){
                    alert("No se ha podido crear usuario");
                    window.location.href = "../index.html";
                }else{
                    console.log(response);
                    alert("SignUp hecho correctamente");
                    window.location.href = "../index.html"
                    
                } 

            });
        }
    }
}

checkUserHosting();