const URLSERVERCreate = "http://localhost:3000/create-pdf";

var pdfBytes;
var pdfDoc;

async function sendData(){

    //pdfBytes = await fetch("document.pdf").then((res) => res.arrayBuffer());
    //pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    const nuevoPDF = {
        name: "pdfPrueba2",
        docBlob: pdfDoc
        
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