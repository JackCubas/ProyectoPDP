const URLSERVERModify = "http://localhost:3000/update-movie/";

async function sendData(){

    //var prodIdHTML = document.getElementById("prodId").value;
    var prodIdHTML = 101;
    var priceHTML = document.getElementById("price").value;
    var quantityHTML = document.getElementById("quantity").value;

    const modMovie = {
        //prodId: prodIdHTML,
        price: priceHTML,
        quantity: quantityHTML
    }

    const response = await fetch(URLSERVERModify + prodIdHTML, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(modMovie)
    })

    window.location.href = "table.html";

}