const URLSERVERdetail = "http://localhost:3000/get-movie/";
//var prodIdHTML = 101;



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
        var con=document.getElementById("main-container")
        for(let i=0;i<data.length;i++){
            console.log(data[i]);
            var d=document.createElement("div")
            d.textContent="ProdID: " + data[i].prodId                      
            con.appendChild(d);

            var e=document.createElement("div")
            e.textContent="Price: " + data[i].price                      
            con.appendChild(e);

            var f=document.createElement("div")
            f.textContent="Quantity: " + data[i].quantity                      
            con.appendChild(f);
        }
}

dataHosting = checkUserHosting();