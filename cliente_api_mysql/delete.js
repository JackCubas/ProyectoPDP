const URLSERVERDelete = "http://localhost:3000/delete-movie/";

function sendData(){

    //var prodIdHTML = document.getElementById("prodId").value;
    var prodIdHTML = 101;
    //var priceHTML = document.getElementById("price").value;
    //var quantityHTML = document.getElementById("quantity").value;

    fetch(URLSERVERDelete + prodIdHTML, {
        method: "DELETE"
    })

    window.location.href = "table.html";

}
