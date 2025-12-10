async function sendData(){
    const URLSERVERUpload = "http://localhost:3000/create-stamp";

    var fileInput = document.getElementById('file');		
	var filePath = fileInput.value;
		
	// Allowing file type
	var allowedExtensions = /(\.jpg|\.png)$/i;
			
	if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type');
        fileInput.value = '';
        return false;
    } 
    else 
    {
			
	// Image preview
	if (fileInput.files && fileInput.files[0]) {

        var jpgExtensions = /(\.jpg)$/i;
        var pngExtensions = /(\.png)$/i;
        var fileType = "";

        if(jpgExtensions.exec(filePath)){
            fileType = ".jpg";
        }

        if(pngExtensions.exec(filePath)){
            fileType = ".png";
        }

        var file = document.getElementById("file").files[0];

        var formData = new FormData();
        formData.append("fileType", fileType);
        formData.append("uploadedFile", file);
        formData.append("userId", 2);

        console.log(formData);
        alert("prueba");

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
}