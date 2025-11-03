const URLSERVERdetail = "http://localhost:3000/get-movie/";
const URLSERVERModify = "http://localhost:3000/update-movie/";

function checkUserHosting() {

    var datosURL = window.location.href.split('?');
    var prodIdHTML = datosURL[1].replace("id=","");

    return fetch(URLSERVERdetail + prodIdHTML)
        .then((response) => { 
            return response.json().then((data) => {
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

function appendData(data){
    if(data && data.length != 0){
        document.getElementById("prodId").value = data[0].prodId;
        document.getElementById("price").value = data[0].price;
        document.getElementById("quantity").value = data[0].quantity;
    }
        
}

dataHosting = checkUserHosting();

async function sendData(){

    //var prodIdHTML = document.getElementById("prodId").value;
    var datosURL = window.location.href.split('?');
    var prodIdHTML = datosURL[1].replace("id=","");

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

    window.location.replace('table.html');

}