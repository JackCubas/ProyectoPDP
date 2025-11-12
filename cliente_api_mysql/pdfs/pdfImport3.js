var datosPDF;

async function sendData(){
    const URLSERVERCreate = "http://localhost:3000/create-pdf";

    var projectName = document.getElementById("project_name").value;

    datosPDF = document.getElementById("filetoRead").files[0];

    var pdfBlob = new Blob([datosPDF], {
        type: "application/pdf"})

    const nuevoPDF = {
        userId: 2,
        name: projectName,
        docBlob: pdfBlob
        
    }

    /*const nuevoPDF = {
        name: projectName,
        docBlob: datosPDF
    }*/        

    await fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoPDF)
    })

}