const URLSERVERretrieve = "http://localhost:3000/get-stamp/";

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario.rolUser != "ADMIN"){
    window.location.href = "../404.html";
}

async function checkUserHosting() {

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    if(idHTML === "" || isNaN(idHTML)){
        window.location.href = 'table_pag.html?page=1';
    }

    console.log("return data");
    return fetch(URLSERVERretrieve + idHTML, {
        method: "GET"
    })
    .then((response) => { 
        console.log(response);

         if(response.status === 400 || response.status === 500){
            alert("No se ha podido encontrar imagen estampado");
            window.location.href = "table.html";
        }else{

            if(response.status === 204){
                alert("No existe imagen estampado");

                stampSelect = document.getElementById("stampSelect");
                stampSelect.removeAttribute('hidden');

            }else{    

                return response.blob().then((data) => {
                            console.log(data);
                            return generateWindow(data);
                        }).catch((err) => {
                            console.log(err);
                        })
            }         

        }
    });
    

}

function generateWindow(blob){

    stampSelect = document.getElementById("stampSelect");
    stampSelect.setAttribute('hidden', "hidden");

    let img = document.createElement("img");
    img.src = URL.createObjectURL(blob);
    //img.width = 300;
    document.body.appendChild(img);
}

async function deleteStamp(){
    const URLSERVERDelete = "http://localhost:3000/delete-stamp";

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    const response = await fetch(URLSERVERDelete + '?userId=' + idHTML, {
        method: "DELETE"
    })

    window.location.href = "table_pag.html?page=1";

}

async function createStamp(){
    const URLSERVERUpload = "http://localhost:3000/create-stamp";

    var datosURL = window.location.href.split('?');
    var idHTML = datosURL[1].replace("id=","");

    var fileInput = document.getElementById('file');		
	var filePath = fileInput.value;

    var result = "";
		
	// Allowing file type
	var allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
			
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
        var jpegExtensions = /(\.jpeg)$/i;
        var pngExtensions = /(\.png)$/i;
        var fileType = "";

        if(jpgExtensions.exec(filePath)){
            fileType = ".jpg";
        }

        if(jpegExtensions.exec(filePath)){
            fileType = ".jpeg";
        }

        if(pngExtensions.exec(filePath)){
            fileType = ".png";
        }

        var file = document.getElementById("file").files[0];

        var formData = new FormData();
        formData.append("fileType", fileType);
        formData.append("uploadedFile", file);
        formData.append("userId", idHTML); //datosUsuario.id

        console.log(formData);
        //alert("prueba");

        //axios.post(URLSERVERUpload,formData).then(res => { console.log(res) })
        
        loader = document.getElementById("loader");
        loader.removeAttribute('hidden');

        const apiCall = await fetch(URLSERVERUpload, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            body: formData,
        }
        );

        result = await apiCall.json();
        console.log(result);

        loader.setAttribute('hidden', "hidden");

    }

    if(result.status === 400 || result.status === 500){
        alert("No se ha podido crear stamp");
        window.location.href = "table_pag.html?page=1";;
    }else{
        alert("Finalizado procesamiento");
        window.location.href = "table_pag.html?page=1";;
    }

    
    }
}


checkUserHosting();