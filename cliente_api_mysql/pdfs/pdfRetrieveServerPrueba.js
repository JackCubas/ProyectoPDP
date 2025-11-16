const URLSERVERretrieve = "http://localhost:3000/retrieve";

function checkUserHosting() {

    //var datosURL = window.location.href.split('?');
    //var IdHTML = datosURL[1].replace("id=","");

    return fetch(URLSERVERretrieve)
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
        var text = document.createTextNode("This just got added");
        con.appendChild(text);
        
}

checkUserHosting();