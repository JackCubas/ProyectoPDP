const URLSERVERgetall = "http://localhost:3000/users_pag";

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

  if(data.length < 10){
    linkNext.href = '#';
  }else{
    linkNext.href="table_pag.html?page=" + pageNumNext;
  } 
}

function buildTable(data) {
  const table = document.getElementById("mytable").getElementsByTagName('tbody')[0];
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);

    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    cell1.textContent = data[i].nameUser;
    
    const butID = data[i].id;

    const button = document.createElement('button');
    button.id = "testbutton" + butID;
    button.textContent = "Click Me";
    button.addEventListener('click', doSmth);
    cell2.appendChild(button);

    const buttonDetail = document.createElement('button');
    buttonDetail.id = "detailbutton" + butID;
    buttonDetail.textContent = "Detail";
    buttonDetail.addEventListener('click', detail);
    cell2.appendChild(buttonDetail);

    const buttonEdit = document.createElement('button');
    buttonEdit.id = "editbutton" + butID;
    buttonEdit.textContent = "Edit";
    buttonEdit.addEventListener('click', edit);
    cell2.appendChild(buttonEdit);

    const buttonDel = document.createElement('button');
    buttonDel.id = "delbutton" + butID;
    buttonDel.textContent = "Delete";
    buttonDel.addEventListener('click', del);
    cell2.appendChild(buttonDel);
  }
}

function doSmth(event) {
  var idDetailString = event.target.id;
  const substringToRemove = "testbutton";
  const idDetail = idDetailString.replace(substringToRemove, '');

  alert("ID: " + idDetail);
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


checkUserHosting();


