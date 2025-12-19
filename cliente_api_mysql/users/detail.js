const URLSERVERdetail = "http://localhost:3000/users/";

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario.rolUser != "ADMIN"){
    window.location.href = "../404.html";
}

function checkUserHosting() {

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

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
        var con=document.getElementById("main-container")
        for(let i=0;i<data.length;i++){
            console.log(data[i]);
            var d=document.createElement("div")
            d.textContent="Name: " + data[i].nameUser                      
            con.appendChild(d);

            var e=document.createElement("div")
            e.textContent="Email: " + data[i].emailUser                      
            con.appendChild(e);

            var f=document.createElement("div")
            f.textContent="Pass: " + data[i].passUser                      
            con.appendChild(f);

            var h=document.createElement("div")
            h.textContent="Rol: " + data[i].rolUser                      
            con.appendChild(h);

            var g=document.createElement("div")
            g.textContent="Key: " + data[i].encryptKeyUser                      
            con.appendChild(g);
        }
}


checkUserHosting();