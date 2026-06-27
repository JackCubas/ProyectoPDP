var URLSERVERdetail = "";
var URLSERVERModify = "";

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario.rolUser != "ADMIN"){
    window.location.href = "../404.html";
}

if(localStorage !== null && localStorage.getItem("backendUrl") !== null){
    const backendUrl = localStorage.getItem("backendUrl");
    URLSERVERdetail = backendUrl + "/users/";
    URLSERVERModify = backendUrl + "/users/";

    //const URLSERVERdetail = "http://localhost:3000/users/";
    //const URLSERVERModify = "http://localhost:3000/users/";
}

var URLString = window.location.href.split('?');
var datosURL = URLString[1].split('&');
var idHTML = datosURL[0].replace("id=","");

/*if(idHTML === "" || isNaN(idHTML)){
    window.location.href = 'table_pag.html?page=1';
}*/

var pageHTML = datosURL[1].replace("page=","");

var filterTrue = "";

if (datosURL.length > 2 && typeof datosURL[2] !== 'undefined' && datosURL[2] !== '' && datosURL[2].includes('true')) {
    filterTrue = true;
}

function checkUserHosting() {


    return fetch(URLSERVERdetail + idHTML)
        .then((response) => { 
            return response.json().then((data) => {
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

function appendData(data){
    if(data && data.length != 0){
        document.getElementById("nameUser").value = data[0].nameUser;

        var decryptedEmail = CryptoJS.AES.decrypt(data[0].emailUser, "firma_app");
        var decryptedEmailString = decryptedEmail.toString(CryptoJS.enc.Utf8);
        document.getElementById("emailUser").value = decryptedEmailString;

        var decryptedPass = CryptoJS.AES.decrypt(data[0].passUser, "firma_app");
        var decryptedPassString = decryptedPass.toString(CryptoJS.enc.Utf8);
        document.getElementById("passUser").value = decryptedPassString;

        document.getElementById("rolUser").value = data[0].rolUser;

        var decryptedDNI = CryptoJS.AES.decrypt(data[0].dniUser, "firma_app");
        var decryptedDNIString = decryptedDNI.toString(CryptoJS.enc.Utf8);
        document.getElementById("dniUser").value = decryptedDNIString;
    }

    var buttons = document.getElementById("button-container");

    var buttonSub = document.createElement("button");
    buttonSub.innerHTML = "Guardar cambios";
    buttonSub.onclick = sendData;
    buttons.appendChild(buttonSub);
    
    if(filterTrue === true){
        var buttonFilter = document.createElement("button");
        buttonFilter.innerHTML = "Regresar a filtro";
        buttonFilter.onclick = onbuttonclickedFiltro;
        buttons.appendChild(buttonFilter);
    }

    var buttonCan = document.createElement("button");
    buttonCan.innerHTML = "Cancelar";
    buttonCan.onclick = onbuttonclicked;
    buttons.appendChild(buttonCan);  
        
}

function onbuttonclicked() {
  //"location.href='table_pag.html?page=' + pageHTML";
  if (onbuttonclicked) {
    window.location.href = "table_pag.html?page=" + pageHTML;
  }
}

function onbuttonclickedFiltro() {
  if (onbuttonclickedFiltro) {
    history.back();
  }
}

async function sendData(){

    //var prodIdHTML = document.getElementById("prodId").value;
    //var datosURL = window.location.href.split('?');
    //var idHTML = datosURL[1].replace("id=","");
    const emailPattern = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
    const dniPattern = /^[0-9]{8}[A-Z]{1}$/;

    nameUser = document.getElementById("nameUser").value;
    emailUser = document.getElementById("emailUser").value;
    passUser = document.getElementById("passUser").value;
    rolUser = document.getElementById("rolUser").value;
    dniUser = document.getElementById("dniUser").value;

    if(nameUser === "" || emailUser === "" || passUser === "" || dniUser === ""){
        modalAlert("Todos los campos son obligatorios.");

    }else if(!emailPattern.test(emailUser)){
        modalAlert('No es un correo electrónico adecuado');

        document.getElementById("emailUser").focus();
        document.getElementById("emailUser").value = "";

    }else if (nameUser.length>50){
        modalAlert("El nombre debe tener menos de 51 caracteres.");

		document.getElementById("nameUser").focus();
        document.getElementById("nameUser").value = "";

    }else if (nameUser.length<2){ 
        modalAlert("El nombre debe tener al menos 2 caracteres.");

		document.getElementById("nameUser").focus();
        document.getElementById("nameUser").value = "";

    }else if (passUser.length>50){
        modalAlert("La contraseña debe tener menos de 51 caracteres.");

		document.getElementById("passUser").focus();
        document.getElementById("passUserRepeat").focus();

        document.getElementById("passUser").value = "";
        document.getElementById("passUserRepeat").value = "";

    }else if (passUser.length<6){ 
        modalAlert("La contraseña debe tener al menos 6 caracteres.");

		document.getElementById("passUser").focus();
        document.getElementById("passUserRepeat").focus();

        document.getElementById("passUser").value = "";
        document.getElementById("passUserRepeat").value = "";   

    }else if(!dniPattern.test(dniUser)){
        modalAlert('No es un DNI adecuado');

        document.getElementById("dniUser").focus();
        document.getElementById("dniUser").value = "";

    }else{

        var emailCrypt = CryptoJS.AES.encrypt(emailUser, "firma_app").toString();
        var passCrypt = CryptoJS.AES.encrypt(passUser, "firma_app").toString();
        var dniCrypt = CryptoJS.AES.encrypt(dniUser, "firma_app").toString();

        const modUser = {
            nameUser: nameUser,
            emailUser: emailCrypt,
            passUser: passCrypt,
            rolUser: rolUser,
            dniUser: dniCrypt 
        }

        const response = await fetch(URLSERVERModify + idHTML, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(modUser)
        })

        if(!response.ok){
            modalAlert("No se ha podido modificar usuario", function() {
                window.location.href = "table_pag.html?page=" + pageHTML;
            });
        }else{

            const result = await response.json();
            console.log(result);

            //alert('status:', response.status);

            if(result.status === 400 || result.status === 500 || result.hasOwnProperty("error")){
                modalAlert("No se ha podido modificar usuario");
            }else{
                //console.log(response);
                modalAlert("Usuario modificado correctamente");
            }
        }

        window.location.href = 'table_pag.html?page=' + pageHTML;

    }
}

checkUserHosting();