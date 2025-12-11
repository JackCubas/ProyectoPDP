const URLSERVERStamp = "http://localhost:3000/stamp/";

const URLSERVERdetail = "http://localhost:3000/pdfs/";
const URLSERVERretrieve = "http://localhost:3000/retrieve/";

/*var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "table.html";
}*/

var thisDocName = "";
var userId = null;
var initialTimestampName = "";

async function returnData() {

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    console.log("return data");
    return fetch(URLSERVERdetail + idHTML)
        .then((response) => { 
            return response.json().then((data) => {
                thisDocName = data[0].DocName;
                userId = data[0].userId;
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

async function retrievePDF() {

    console.log("retrieve pdf: " + URLSERVERretrieve + thisDocName + "/" + userId + "/" + initialTimestampName);
    return fetch(URLSERVERretrieve + thisDocName + "/" + userId + "/" + initialTimestampName, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then((response) => { 
        console.log(response);
        return response.blob().then((data) => {
                    console.log(data);
                    return generateWindow(data);
                }).catch((err) => {
                    console.log(err);
                }) 


    });
    

}

//pdfs.id as pdfId, pdfs.name AS DocName, urlCarpeta, nameUser, userId
function appendData(data){
    var con=document.getElementById("main-container")
    for(let i=0;i<data.length;i++){
        console.log(data[i]);
        var d=document.createElement("div");
        d.textContent="Doc Name: " + data[i].DocName;
        thisDocName = data[i].DocName;                     
        con.appendChild(d);

        var e=document.createElement("div")
        e.textContent="Doc URL: " + data[i].urlCarpeta                      
        con.appendChild(e);

        var f=document.createElement("div")
        f.textContent="User Name: " + data[i].nameUser                      
        con.appendChild(f);

        var g=document.createElement("div")
        g.textContent="Estado: " + data[i].estado                      
        con.appendChild(g);

        var h=document.createElement("div");

        var initialTimestampNameAux = data[0].initialUploadTimestamp.slice(0, 19).replace('T', ' ');
        var initialTimestampNameAux2 = initialTimestampNameAux.replace(" ","_").replaceAll(":","-");
        initialTimestampName = initialTimestampNameAux2.replaceAll("-","_");
        
        h.textContent="Creation DateTime: " + initialTimestampNameAux;                      
        con.appendChild(h);
    }
    console.log("finalizado generacion de ventana");
}

function generateWindow(response){

    const fileURL = URL.createObjectURL(response);
    console.log(fileURL);
    window.open(fileURL); 
}

function checkUserHosting(){

    var idHTML = null;
    var datosURL = window.location.href.split('?');
    idHTML = datosURL[1].replace("id=","");

    if(idHTML === null || idHTML === ""){
        window.location.href = "table.html";
    }else{

        returnData().then(() => {
            retrievePDF();
        })
    }
    
}

checkUserHosting();

async function sendData(){

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    const modUser = {
        filename: thisDocName,
        stampUserId: 2
    }

    /*const apiCall = await fetch(URLSERVERStamp + idHTML, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(modUser)
    }
    );

    const result = await apiCall.json();
    console.log(result);*/

    return fetch(URLSERVERStamp + idHTML, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(modUser)
    })
    .then((response) => { 
        console.log(response);
        return response.blob().then((data) => {
            console.log(data);
            return generateWindow(data);
        }).catch((err) => {
            console.log(err);
        }) 


    });

    window.location.href = "table.html";

}