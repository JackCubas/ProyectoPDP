const URLSERVERlogin = "http://localhost:3000/users/login";

var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "../index.html";
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

}

function checkData(data){
    var existe = data[0].user;
    if(existe == false){
        alert("false");
        console.log("Usuario no existe");
        localStorage.setItem("usuarioExistente", "false");
    }
    if(existe == "ADMIN"){
        alert("ADMIN");
        console.log("Usuario ADMIN");
        localStorage.setItem("usuarioExistente", "ADMIN");
    }
    if(existe == "CLIENT"){
        alert("CLIENT");
        console.log("Usuario CLIENT");
        localStorage.setItem("usuarioExistente", "CLIENT");
    }

    console.log(localStorage.getItem("usuarioExistente"))
    //localStorage.clear();
    window.location.href = "../index.html";
}
