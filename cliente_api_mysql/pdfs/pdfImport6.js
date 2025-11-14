

async function sendData(){
    const URLSERVERCreate = "http://localhost:3000/create-pdf";

    var projectName = document.getElementById("project_name").value;

    //var pdfBlob = new Blob([datosPDF], {
    //    type: "application/pdf"})

    var pdfDatos = document.getElementById("filetoRead").files[0];

    console.log("prueba")
    console.log(pdfDatos);
    alert("prueba");

   /*let formData = new FormData()
   formData.append("USER: " + 2 + " - NAME: " + projectName, pdfDatos)

   const nuevoPDF = {
        userId: 2,
        name: projectName,
        docDatos: formData  
    }*/

    const nuevoPDF = {
        userId: 2,
        name: projectName,
        docDatos: pdfDatos
        
    }

    

    console.log(nuevoPDF);

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