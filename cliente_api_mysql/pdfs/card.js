var datosUsuario = null;

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}


async function sendData(){

    const URLSERVERlecturatarjeta = "http://localhost:3000/lecturaTarjeta";


    const fdUser = {
        fdUserId: datosUsuario.id,
    }

    return fetch(URLSERVERlecturatarjeta, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(fdUser)
    })
    .then((response) => { 
        console.log(response);

        if(response.status === 400 || response.status === 500){
            alert("No se ha podido hacer lectura de tarjega");
            window.location.href = "table.html?page=1";
        }else{

            alert("Se ha podido hacer lectura de tarjeta");
            window.location.href = "table.html?page=1";
        } 

    });

}
