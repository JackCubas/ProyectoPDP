const URLSERVERdetail = "http://localhost:3000/users/";
const URLSERVERModify = "http://localhost:3000/users/";

function checkUserHosting() {

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    if(idHTML === "" || isNaN(idHTML)){
        window.location.href = 'table.html';
    }

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
        document.getElementById("emailUser").value = data[0].emailUser;
        document.getElementById("passUser").value = data[0].passUser;
        document.getElementById("encryptKeyUser").value = data[0].encryptKeyUser;
    }
        
}

async function sendData(){

    //var prodIdHTML = document.getElementById("prodId").value;
    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    nameUser = document.getElementById("nameUser").value;
    emailUser = document.getElementById("emailUser").value;
    passUser = document.getElementById("passUser").value;
    encryptKeyUser = document.getElementById("encryptKeyUser").value;

    const modUser = {
        nameUser: nameUser,
        emailUser: emailUser,
        passUser: passUser,
        encryptKeyUser: encryptKeyUser 
    }

    const response = await fetch(URLSERVERModify + idHTML, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(modUser)
    })

    alert('status:', response.status);

    window.location.href = 'table.html';

}

checkUserHosting();