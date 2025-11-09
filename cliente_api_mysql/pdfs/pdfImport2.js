const URLSERVERCreate = "http://localhost:3000/create-pdf";

var pdfBytes;
var pdfDoc;

async function sendData(){

    //pdfBytes = await fetch("document.pdf").then((res) => res.arrayBuffer());
    //pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const inputValue = document.getElementById('myInputPDF').value;
    var projectName = document.getElementById("project_name").value;

    alert(inputValue);

    const nuevoPDF = {
        name: projectName,
        docBlob: inputValue
        
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