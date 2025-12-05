console.log("index");
//console.log(localStorage);
console.log(JSON.parse(localStorage.getItem("usuario")));

if(localStorage.getItem("usuario") === null){
    document.getElementById("logoutButton").style.display = 'none';
}