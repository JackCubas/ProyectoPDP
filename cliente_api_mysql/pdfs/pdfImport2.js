const URLSERVERCreate = "http://localhost:3000/create-pdf";

var pdfBytes;
var pdfDoc;

async function sendData(){

    //pdfBytes = await fetch("document.pdf").then((res) => res.arrayBuffer());
    //pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

    //const inputValue = document.getElementById('myInputPDF').value;
    var projectName = document.getElementById("project_name").value;
    const inputValue = document.getElementById("myInputPDF").files[0];
    
    console.log(inputValue);
    alert("prueba");

    const nuevoPDF = {
        userId: 2,
        name: projectName,
        docDatos: inputValue
        
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