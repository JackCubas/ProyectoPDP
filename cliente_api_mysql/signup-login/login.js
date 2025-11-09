const URLSERVERlogin = "http://localhost:3000/users/login";

var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "../main.html";
}

function sendData(){


    var emailUser = document.getElementById("emailUser").value;
    var passUser = document.getElementById("passUser").value;

    const loginUsers = {
        emailUser: emailUser,
        passUser: passUser
    }

    return fetch(URLSERVERlogin, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(loginUsers)
        })
        .then((response) => {
            alert(response); 
            return response.json().then((data) => {
                alert(data);
                return checkData(data);
        }).catch((err) => {
            console.log(err);
        }) 
    });

     window.location.href = "../main.html";
}

function checkData(data){
    var existe = data[0].user;
    if(existe == true){
        alert("true");
        console.log("Usuario existe");
    }else{
        alert("false");
        console.log("Usuario no existe");
    }
}
