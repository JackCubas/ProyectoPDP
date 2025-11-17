const URLSERVERretrieve = "http://localhost:3000/retrieve";

async function checkUserHosting() {

    //var datosURL = window.location.href.split('?');
    //var IdHTML = datosURL[1].replace("id=","");

    const apiCall = await fetch(URLSERVERretrieve);
    const result = await apiCall.json();
    console.log(result);
    console.log("Analizando resultados");
    appendData(result);

}

function appendData(data){
        var con=document.getElementById("main-container")
        var text = document.createTextNode("This just got added");
        con.appendChild(text);
        
}

checkUserHosting();