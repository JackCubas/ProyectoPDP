const URLSERVERCreate = "http://localhost:3000/moviesCreate";

function sendData2(){

    const newMovie = {
    prodId: 1017,
    price: 433,
    quantity: 555
    }

    fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newMovie)
    })

}


function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
    }
   xmlHttp.open("POST", theUrl, true); // true for asynchronous
   xmlHttp.send(JSON.stringify({x: 5}));
}


httpGetAsync(URLSERVERCreate, function(response) {
  console.log("recieved ... ", response);
});

async function sendData(){
    const newMovie = {
    prodId: 1017,
    price: 433,
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
}

//sendData();
//httpGetAsync(URLSERVERCreate);
sendData2();
