const URLSERVERCreate = "http://localhost:3000/create-movie";

function sendData(){

    //event.preventDefault();

    var prodIdHTML = document.getElementById("prodId").value;
    var priceHTML = document.getElementById("price").value;
    var quantityHTML = document.getElementById("quantity").value;

    const nuevoMovie = {
        prodId: prodIdHTML,
        price: priceHTML,
        quantity: quantityHTML
    }

    fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoMovie)
    })
    .then(response => {
            console.log('status:', response.status);
            window.location.href = "table.html";
    })
    .catch(error => {
            console.error('Error:', error);
    })        
    //.then(console.log('status:', response.status))
    //.then(window.location.href = "table.html")

    //alert('status:', response.status);

    //window.location.href = "table.html";

}
