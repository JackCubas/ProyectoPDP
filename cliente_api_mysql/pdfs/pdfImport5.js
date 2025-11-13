var datosPDF;
const URLSERVERCreate = "http://localhost:3000/create-pdf";

async function sendData(){

    var projectName = document.getElementById("project_name").value;
    var pdfDatosBrutos = document.getElementById("filetoRead").files[0];

    console.log("prueba")
    console.log(pdfDatosBrutos);
    alert("prueba");

    let reader = new FileReader();
    reader.readAsDataURL(pdfDatosBrutos);
    reader.onload = () => {
        datosPDF = JSON.stringify({ dataURL: reader.result });
    }
    
    console.log("prueba3")
    console.log(datosPDF);
    alert("prueba3");

    const nuevoPDF = {
        userId: 2,
        name: projectName,
        docDatos: datosPDF
        
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