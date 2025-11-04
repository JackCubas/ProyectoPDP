const URLSERVERCreate = "http://localhost:3000/create-movie";

async function sendData(){

    //event.preventDefault();

    var prodIdHTML = document.getElementById("prodId").value;
    var priceHTML = document.getElementById("price").value;
    var quantityHTML = document.getElementById("quantity").value;

    const nuevoMovie = {
        prodId: prodIdHTML,
        price: priceHTML,
        quantity: quantityHTML
    }

    const response = await fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoMovie)
    })
    //.then(console.log('status:', response.status))
    //.then(window.location.href = "table.html")

    alert('status:', response.status);

    window.location.href = "table.html";

}
