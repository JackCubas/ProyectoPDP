console.log("index");
//console.log(localStorage);
console.log(JSON.parse(localStorage.getItem("usuario")));

var datosUsuario = null;

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario === null){
    document.getElementById("logoutButton").style.display = 'none';
    document.getElementById("movieButton").style.display = 'none';
}else{

    if(datosUsuario.rolUser != "ADMIN"){
        document.getElementById("movieButton").style.display = 'none';
    }

}

