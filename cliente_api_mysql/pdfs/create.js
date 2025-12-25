var datosUsuario = null;

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

async function sendData(){
    const URLSERVERUpload = "http://localhost:3000/create-pdf";

    var fileInput = document.getElementById('file');
			
    var filePath = fileInput.value;

    // Allowing file type
    var allowedExtensions = /(\.pdf)$/i;
    
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        fileInput.value = '';
        return false;
    } else { 

        var projectName = document.getElementById("name").value;
        var file = document.getElementById("file").files[0];

        var formData = new FormData();
        formData.append("filename", projectName);
        formData.append("estado", "PENDING");
        formData.append("uploadedFile", file);
        formData.append("userId", datosUsuario.id);

        console.log(formData);
        //alert("prueba");

        //axios.post(URLSERVERUpload,formData).then(res => { console.log(res) })

        const apiCall = await fetch(URLSERVERUpload, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: formData,
        }
        );

        const result = await apiCall.json();
        console.log(result);
    }

    window.location.href = "table.html";

}