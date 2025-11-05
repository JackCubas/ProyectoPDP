const URLSERVERCreate = "http://localhost:3000/create-pdf";
var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "pdf.html";
}

async function sendData(){


    const nuevoPDF = {
        name: "pdfPrueba",
        pdfBase64: ""
        
    }

    await fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoPDF)
    })

}