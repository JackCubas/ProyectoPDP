const URLSERVERCreate = "http://localhost:3000/create-movie";

async function sendData(){

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

    console.log('status:', response.status)

    //window.location.replace("table.html");

}

//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------

//WIP


/*async function sendData2(){

    const newMovie = {
        prodId: 555,
        price: 555,
        quantity: 555
    }

    // a POST request
    const response = await fetch(URLSERVERCreate, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(newMovie)
    })

    console.log('status:', response.status)
}*/


/*function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
    }
   xmlHttp.open("POST", theUrl, true); // true for asynchronous
   xmlHttp.send(JSON.stringify({x: 5}));
}*/


/*httpGetAsync(URLSERVERCreate, function(response) {
  console.log("recieved ... ", response);
});*/


//sendData();
//httpGetAsync(URLSERVERCreate);
//sendData();
