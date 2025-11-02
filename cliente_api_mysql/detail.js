const URLSERVERdetail = "http://localhost:3000/get-movie/";
var prodIdHTML = 101;

function checkUserHosting() {
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
            var d=document.createElement("div")

            console.log(data[i]);
            console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")

            d.textContent="ProdID: " + data[i].prodId
            //add the data in whatever html element you want and then append it to the container
            //d.textContent = "       " + "Price: " + data[i].price;
            //d.textContent = "       " + "Quality: " + data[i].quality;
            
            con.appendChild(d);
        }
}

dataHosting = checkUserHosting();