const URLSERVERCreate = "http://localhost:3000/create-movie";
var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "pdf.html";
}

async function sendData(){


    returnToTable = true;

    var prodIdHTML = document.getElementById("prodId").value;
    var priceHTML = document.getElementById("price").value;
    var quantityHTML = document.getElementById("quantity").value;

    const nuevoMovie = {
        prodId: prodIdHTML,
        price: priceHTML,
        quantity: quantityHTML
    }

    await fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoMovie)
    })

}