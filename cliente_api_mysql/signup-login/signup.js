const URLSERVERCreate = "http://localhost:3000/users";

//create.html?prodId=34&price=34&quantity=34
//?prodId=34&price=34&quantity=34
var datosURL = window.location.href;

if(datosURL.includes("?")){
    //alert(datosURL);
    var datosURLSplit = window.location.href.split('?');
    var datosURLNuevo = datosURLSplit[0];

    window.history.replaceState( {} , '', datosURLNuevo);
    //window.location.href = datosURLNuevo;
}

async function sendData(){

    //event.preventDefault();

    var nameUser = document.getElementById("nameUser").value;
    var emailUser = document.getElementById("emailUser").value;
    var passUser = document.getElementById("passUser").value;
    var passUserRepeat = document.getElementById("passUserRepeat").value;
    var encryptKeyUser = document.getElementById("encryptKeyUser").value;
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
            const nuevoUsers = {
                nameUser: nameUser,
                emailUser: emailUser,
                passUser: passUser,
                encryptKeyUser: encryptKeyUser,
                rolUser: rolUser
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

            alert("SignUp hecho correctamente");

            window.location.href = "../index.html";
        }
    }
}