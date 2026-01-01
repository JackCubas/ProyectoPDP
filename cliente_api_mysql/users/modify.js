const URLSERVERdetail = "http://localhost:3000/users/";
const URLSERVERModify = "http://localhost:3000/users/";

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario.rolUser != "ADMIN"){
    window.location.href = "../404.html";
}

var URLString = window.location.href.split('?');
var datosURL = URLString[1].split('&');
var idHTML = datosURL[0].replace("id=","");

/*if(idHTML === "" || isNaN(idHTML)){
    window.location.href = 'table_pag.html?page=1';
}*/

var pageHTML = datosURL[1].replace("page=","");

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

    //var prodIdHTML = document.getElementById("prodId").value;
    //var datosURL = window.location.href.split('?');
    //var idHTML = datosURL[1].replace("id=","");

    nameUser = document.getElementById("nameUser").value;
    emailUser = document.getElementById("emailUser").value;
    passUser = document.getElementById("passUser").value;
    rolUser = document.getElementById("rolUser").value;
    dniUser = document.getElementById("dniUser").value;

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
        alert("No se ha podido modificar usuario");
        window.location.href = "table_pag.html?page=" + pageHTML;
    }else{

        const result = await response.json();
        console.log(result);

        //alert('status:', response.status);

        if(result.status === 400 || result.status === 500 || result.hasOwnProperty("error")){
            alert("No se ha podido modificar usuario");
        }else{
            //console.log(response);
            alert("Usuario modificado correctamente");
        }
    }

    window.location.href = 'table_pag.html?page=' + pageHTML;

}

checkUserHosting();