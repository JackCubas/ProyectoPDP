const URLSERVERdetail = "http://localhost:3000/pdfs/";
const URLSERVERretrieve = "http://localhost:3000/retrieve/";

var thisDocName = "";

async function returnData() {

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    console.log("return data");
    return fetch(URLSERVERdetail + idHTML)
        .then((response) => { 
            return response.json().then((data) => {
                thisDocName = data[0].DocName;
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

async function retrievePDF() {

    console.log("retrieve pdf: " + URLSERVERretrieve + thisDocName);
    return fetch(URLSERVERretrieve + thisDocName, {
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
    }
    console.log("finalizado generacion de ventana");
}

function generateWindow(response){

    const fileURL = URL.createObjectURL(response);
    console.log(fileURL);
    window.open(fileURL); 
}

function checkUserHosting(){
    returnData().then(() => {
        retrievePDF();
    })
    
}

checkUserHosting();