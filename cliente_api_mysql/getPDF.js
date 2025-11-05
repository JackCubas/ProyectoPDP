const URLSERVERpdfs = "http://localhost:3000/pdfs";

function checkUserHosting() {

    return fetch(URLSERVERpdfs)
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

        }
}

checkUserHosting();