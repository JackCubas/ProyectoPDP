const URLSERVERgetall = "http://localhost:3000/users_pag";

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
    datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(datosUsuario.rolUser != "ADMIN"){
    window.location.href = "../404.html";
}

var datosURL = window.location.href.split('?');
var page = datosURL[1].replace("page=","");

console.log(datosURL);
console.log("page " + page);

function checkUserHosting() {

    return fetch(URLSERVERgetall + '?page=' + page)
        .then((response) => { 
            return response.json().then((data) => {
                //return appendData(data);
                return buildVentana(data);
            }).catch((err) => {
                console.log(err);
                return buildVentana(null);
            }) 
        });

}

function buildVentana(data){
  console.log(data);
  buildPaginacion(data);
  buildTable(data);

}


function buildPaginacion(data){
  const linkPrev  = document.getElementById("pagePrev");
  const linkNext  = document.getElementById("pageNext");

  pageNum = parseInt(page);
  pageNumPrev = pageNum - 1;
  pageNumNext = pageNum + 1;

  console.log("pageNum " + pageNum);
  console.log("prev " + pageNumPrev);
  console.log("next" + pageNumNext);
  
  if(pageNumPrev == 0){
    linkPrev.href = '#';
  }else{
    linkPrev.href="table_pag.html?page=" + pageNumPrev;
  }

  if(data != null && data.length < 10){
    linkNext.href = '#';
  }else{
    linkNext.href="table_pag.html?page=" + pageNumNext;
  } 
}

function buildTable(data) {
  const table = document.getElementById("mytable").getElementsByTagName('tbody')[0];
  if(data !== null && data.length > 0){
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);

      const newRow = table.insertRow();
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      cell1.textContent = data[i].nameUser;
      cell2.textContent = data[i].rolUser;

      const butID = data[i].id;

      const buttonDetail = document.createElement('button');
      buttonDetail.id = "detailbutton" + butID;
      buttonDetail.textContent = "Detail";
      buttonDetail.addEventListener('click', detail);
      cell3.appendChild(buttonDetail);

      const buttonEdit = document.createElement('button');
      buttonEdit.id = "editbutton" + butID;
      buttonEdit.textContent = "Edit";
      buttonEdit.addEventListener('click', edit);
      cell3.appendChild(buttonEdit);

      const buttonDel = document.createElement('button');
      buttonDel.id = "delbutton" + butID;
      buttonDel.textContent = "Delete";
      buttonDel.addEventListener('click', del);
      cell3.appendChild(buttonDel);

      const buttonStamp = document.createElement('button');
      buttonStamp.id = "stampbutton" + butID;
      buttonStamp.textContent = "Stamp";
      buttonStamp.addEventListener('click', stamp);
      cell3.appendChild(buttonStamp);
    }
  }else{
    const emptyRow = table.insertRow();
    const cellempty = emptyRow.insertCell(0);
    cellempty.textContent = "No users have been found"
  }
}

function detail(event){
  console.log("DETAIL");
  //console.log(event);

  var idDetailString = event.target.id;
  const substringToRemove = "detailbutton";
  const idDetail = idDetailString.replace(substringToRemove, '');

  //alert("DETAIL " + idDetail);

  window.location.href = "detail.html?id=" + idDetail;
}

function edit(event){
  console.log("EDIT");

  var idEditString = event.target.id;
  const substringToRemove = "editbutton";
  const idEdit = idEditString.replace(substringToRemove, '');

  //alert("EDIT " + idEdit);

  window.location.href = "modify.html?id=" + idEdit;
}

function del(event){
  console.log("DELETE");
  //alert("DELETE " + event.target.id);

  var idDelString = event.target.id;
  const substringToRemove = "delbutton";
  const idDel = idDelString.replace(substringToRemove, '');

  //alert("DEL " + idDel);

  window.location.href = "delete.html?id=" + idDel;
}

function stamp(event){
  console.log("STAMP");
  //alert("DELETE " + event.target.id);

  var idStampString = event.target.id;
  const substringToRemove = "stampbutton";
  const idStamp = idStampString.replace(substringToRemove, '');

  //alert("DEL " + idDel);

  window.location.href = "stamp.html?id=" + idStamp;
}


checkUserHosting();


