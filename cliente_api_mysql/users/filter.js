var URLSERVERpdfcriteria = "";
var emailUser = "";
var nameUser = "";
var rolUser = "";


if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if((datosUsuario.rolUser === "CLIENT")){
  window.location.href = "../404.html";
}

if(localStorage !== null && localStorage.getItem("backendUrl") !== null){
  const backendUrl = localStorage.getItem("backendUrl");
  URLSERVERusercriteria = backendUrl + "/clientsByCriteria";

  //const URLSERVERpdfcriteria = "http://localhost:3000/pdfsByCriteria";
}

/*var datosURL = window.location.href;

if(datosURL.includes("?") || datosURL.includes("&") || datosURL.includes("=")){
    window.location.href = "../index.html";
}*/

async function sendData(){

    emailUser = document.getElementById("emailUser").value;
    nameUser = document.getElementById("nameUser").value;
    rolUser = document.getElementById("rolUser").value;

    //?color1=red&color2=blue

    return fetch(URLSERVERusercriteria + '?emailUser=' + emailUser + '&nameUser=' + nameUser + '&rolUser=' + rolUser)
    .then((response) => { 
            return response.json().then((data) => {
                //return appendData(data);
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });    
}

function appendData(data){
    console.log(data);

    let parent = document.getElementById("mytable").getElementsByTagName('tbody')[0];
    empty(parent);

    const mainParent = document.getElementById("main-container");
    empty(mainParent);

    const table = document.getElementById("mytable").getElementsByTagName('tbody')[0];

    const main = document.getElementById("main-container");

    if(data !== null && data.length > 0){

        for(let i=0;i<data.length;i++){
            console.log(data[i]);

            const newRow = table.insertRow();

            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(1);

            cell1.innerText = data[i].nameUser;
            cell2.innerText = data[i].rolUser;

            const butID = data[i].pdfId;

            const buttonDetail = document.createElement('button');
            buttonDetail.id = "detailbutton" + butID;
            buttonDetail.textContent = "Detalle";
            buttonDetail.addEventListener('click', detail);
            cell3.appendChild(buttonDetail);

            const buttonEdit = document.createElement('button');
            buttonEdit.id = "editbutton" + butID;
            buttonEdit.textContent = "Editar";
            buttonEdit.addEventListener('click', edit);
            cell3.appendChild(buttonEdit);

            const buttonDel = document.createElement('button');
            buttonDel.id = "delbutton" + butID;
            buttonDel.textContent = "Eliminar";
            buttonDel.addEventListener('click', del);
            cell3.appendChild(buttonDel);
        
        }
    }else{
        
        var newParagraph = document.createElement('p');
        newParagraph.textContent = 'No se han encontrado documentos';
        main.append(newParagraph);
    }

    var form = document.getElementById("form"); 
    function handleForm(event) {     
        event.preventDefault(); 
    }  
    form.addEventListener('submit', handleForm);
    
    console.log("finalizado generacion de ventana");
    //alert("final");
}


function checkUserHosting() {
    return fetch(URLSERVERusercriteria + '?emailUser=' + emailUser + '&nameUser=' + nameUser + '&rolUser=' + rolUser)
        .then((response) => { 
            return response.json().then((data) => {
                //return appendData(data);
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}


function detail(event){
  console.log("DETAIL");
  //console.log(event);

  var idDetailString = event.target.id;
  const substringToRemove = "detailbutton";
  const idDetail = idDetailString.replace(substringToRemove, '');

  //alert("DETAIL " + idDetail);

  window.location.href = "detail.html?id=" + idDetail + "&page=1";
}

function edit(event){
  console.log("EDIT");

  var idEditString = event.target.id;
  const substringToRemove = "editbutton";
  const idEdit = idEditString.replace(substringToRemove, '');

  //alert("EDIT " + idEdit);

  window.location.href = "modify.html?id=" + idEdit + "&page=1";
}

function del(event){
  console.log("DELETE");
  //alert("DELETE " + event.target.id);

  var idDelString = event.target.id;
  const substringToRemove = "delbutton";
  const idDel = idDelString.replace(substringToRemove, '');

  //alert("DEL " + idDel);

  window.location.href = "delete.html?id=" + idDel + "&page=1&new=1";
}

checkUserHosting();

function empty(element) {
  while(element.firstElementChild) {
     element.firstElementChild.remove();
  }
}
