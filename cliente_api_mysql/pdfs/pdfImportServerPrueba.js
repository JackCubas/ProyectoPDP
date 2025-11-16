async function sendData(){
    const URLSERVERUpload = "http://localhost:3000/upload";

    var projectName = document.getElementById("name").value;
    var file = document.getElementById("file").files[0];

    console.log("prueba")
    alert("prueba");

    var formData = new FormData();
    formData.append("filename", projectName);
    formData.append("uploadedFile", file);

    axios.post(URLSERVERUpload,formData).then(res => { console.log(res) })

}