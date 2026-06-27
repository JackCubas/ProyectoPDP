var backendUrl = "";
var URLSERVERgetall = ""; //"http://localhost:3000/pdfs";
var datosUsuario = null;

if(localStorage === null || localStorage.getItem("usuario") === null){
  window.location.href = "../404.html";
}

if(localStorage.getItem("usuario") !== null){
     datosUsuario = JSON.parse(localStorage.getItem("usuario"));
}

if(localStorage !== null && localStorage.getItem("backendUrl") !== null){
  backendUrl = localStorage.getItem("backendUrl");
}

if((datosUsuario.rolUser === "ADMIN") || (datosUsuario.rolUser === "FIRMA")){
  //URLSERVERgetall = "http://localhost:3000/pdfs_pag"
  URLSERVERgetall = backendUrl + "/pdfs_pag"
}

if((datosUsuario.rolUser === "CLIENT")){
  //document.getElementById("filterPDF").setAttribute('hidden', "hidden");
  //var URLSERVERgetallAux = "http://localhost:3000/pdfsByUser_pag/"

  var URLSERVERgetallAux = backendUrl + "/pdfsByUser_pag/"
  URLSERVERgetall = URLSERVERgetallAux + datosUsuario.id
}

var datosURL = window.location.href.split('?');
var page = datosURL[1].replace("page=","");

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
  var currentPageNum = buildPaginacion(data);
  buildTable(data, currentPageNum);

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
    linkPrev.href="table.html?page=" + pageNumPrev;
  }

  if(data != null && data.length < 10){
    linkNext.href = '#';
  }else{
    linkNext.href="table.html?page=" + pageNumNext;
  }
  
  return pageNum;
}

function buildTable(data, currentPageNum) {

  const main = document.getElementById("main-container");

  var a = document.createElement('a');
  var linkTexta = document.createTextNode("Crear documento");
  a.appendChild(linkTexta);
  a.title = "Crear documento";
  a.id = "createPDF";
  a.href = 'create.html?page=' + currentPageNum;
  a.className = 'button';
  main.appendChild(a);

  var b = document.createElement('a');
  var linkTextb = document.createTextNode("Filtrar");
  b.appendChild(linkTextb);
  b.title = "Filtrar";
  b.id = "filterPDF";
  b.href = "filter.html";
  b.className = 'button';
  main.appendChild(b);

  if((datosUsuario.rolUser === "CLIENT")){
    document.getElementById("filterPDF").setAttribute('hidden', "hidden");
  }  

  var c = document.createElement('a');
  var linkTextc = document.createTextNode("Control de estampados");
  c.appendChild(linkTextc);
  c.title = "Control de estampados";
  c.id = "stampControl";
  c.href = "stampControl.html";
  c.className = 'button';
  main.appendChild(c);

  console.log(data);
  const table = document.getElementById("mytable").getElementsByTagName('tbody')[0];
  if(data !== null && data.length > 0){
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);

      const newRow = table.insertRow();
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      cell1.textContent = data[i].DocName;
      cell2.textContent = data[i].nameUser;
      
      const butID = data[i].pdfId;

      const buttonDetail = document.createElement('button');
      buttonDetail.id = "detailbutton" + butID + "-" + currentPageNum + "-" + data.length;
      buttonDetail.textContent = "Detalle";
      buttonDetail.addEventListener('click', detail);
      cell3.appendChild(buttonDetail);

      const buttonEdit = document.createElement('button');
      buttonEdit.id = "editbutton" + butID + "-" + currentPageNum + "-" + data.length;
      buttonEdit.textContent = "Editar";
      buttonEdit.addEventListener('click', edit);
      cell3.appendChild(buttonEdit);

      const buttonDel = document.createElement('button');
      buttonDel.id = "delbutton" + butID + "-" + currentPageNum + "-" + data.length;
      buttonDel.textContent = "Eliminar";
      buttonDel.addEventListener('click', del);
      cell3.appendChild(buttonDel);

      if((datosUsuario.rolUser === "ADMIN") || (datosUsuario.rolUser === "FIRMA")){
        const buttonSign = document.createElement('button');
        buttonSign.id = "signbutton" + butID + "-" + currentPageNum + "-" + data.length;
        buttonSign.textContent = "Firmar";
        buttonSign.addEventListener('click', sign);
        cell3.appendChild(buttonSign);

        const buttonStamp = document.createElement('button');
        buttonStamp.id = "stampbutton" + butID + "-" + currentPageNum + "-" + data.length;
        buttonStamp.textContent = "Estampar";
        buttonStamp.addEventListener('click', stamp);
        cell3.appendChild(buttonStamp);

        /*const buttonFDATR = document.createElement('button');
        buttonFDATR.id = "FDATRbutton" + butID + "-" + currentPageNum + "-" + data.length;
        buttonFDATR.textContent = "Firma digital ATR";
        buttonFDATR.addEventListener('click', firmadoDigitalATR);
        cell3.appendChild(buttonFDATR);*/

        const buttonFDCliente = document.createElement('button');
        buttonFDCliente.id = "FDClientebutton" + butID + "-" + currentPageNum + "-" + data.length;
        buttonFDCliente.textContent = "Firma digital cliente";
        buttonFDCliente.addEventListener('click', firmadoDigitalCliente);
        cell3.appendChild(buttonFDCliente);
      }
    }
  }else{
    //const emptyRow = table.insertRow();
    //const cellempty = emptyRow.insertCell(0);
    //cellempty.textContent = "No documents have been found"

    var newParagraph = document.createElement('p');
    newParagraph.textContent = 'No se han encontrado documentos';
    main.append(newParagraph);
  }
}

function detail(event){
  console.log("DETAIL");
  //console.log(event);

  var idDetailString = event.target.id;
  const substringToRemove = "detailbutton";
  var datosDetailString = idDetailString.replace(substringToRemove, '');
  var datosDetail = datosDetailString.split('-');

  //alert("DETAIL " + idDetail);

  window.location.href = "detail.html?id=" + datosDetail[0] + "&page=" + datosDetail[1];
}

function edit(event){
  console.log("EDIT");

  var idEditString = event.target.id;
  const substringToRemove = "editbutton";
  var datosEditString = idEditString.replace(substringToRemove, '');
  var datosEdit = datosEditString.split('-');

  //alert("EDIT " + idEdit);

  window.location.href = "modify.html?id=" + datosEdit[0] + "&page=" + datosEdit[1];
}

function del(event){
  console.log("DELETE");
  //alert("DELETE " + event.target.id);

  var idDelString = event.target.id;
  const substringToRemove = "delbutton";
  var datosDelString = idDelString.replace(substringToRemove, '');
  var datosDel = datosDelString.split('-');

  if(!isNaN(datosDel[1]) && !isNaN(datosDel[2])){

    var currentPageNum = parseInt(datosDel[1]);
    var numUsers = parseInt(datosDel[2]);

    var newPageNum = currentPageNum;

    if(numUsers === 1 && currentPageNum > 1){
      newPageNum = currentPageNum - 1;
    }
  }


  //alert("DEL " + idDel);

  window.location.href = "delete.html?id=" + datosDel[0] + "&page=" + datosDel[1] + "&new=" + newPageNum;
}

function sign(event) {
  var idSignString = event.target.id;
  const substringToRemove = "signbutton";
  var datosSignString = idSignString.replace(substringToRemove, '');
  var datosSign = datosSignString.split('-');

  //alert("Sign: " + idSign);

  window.location.href = "sign.html?id=" + datosSign[0] + "&page=" + datosSign[1];
}

function stamp(event) {
  var idStampString = event.target.id;
  const substringToRemove = "stampbutton";
  var datosStampString = idStampString.replace(substringToRemove, '');
  var datosStamp = datosStampString.split('-');

  window.location.href = "stamp.html?id=" + datosStamp[0] + "&page=" + datosStamp[1];
}

function firmadoDigitalATR(event) {
  var idFirmadoDigitalATR = event.target.id;
  const substringToRemove = "FDATRbutton";
  var idFDATRString = idFirmadoDigitalATR.replace(substringToRemove, '');
  var datosFDATR = idFDATRString.split('-');

  //alert("Firmado digital: " + datosFD[0]);

  window.location.href = "firmadoDigitalATR.html?id=" + datosFDATR[0] + "&page=" + datosFDATR[1];
}

function firmadoDigitalCliente(event) {
  var idFirmadoDigitalCli = event.target.id;
  const substringToRemove = "FDClientebutton";
  var idFDCliString = idFirmadoDigitalCli.replace(substringToRemove, '');
  var datosFDCli = idFDCliString.split('-');

  //alert("Firmado digital: " + datosFD[0]);

  window.location.href = "firmadoDigitalCliente.html?id=" + datosFDCli[0] + "&page=" + datosFDCli[1];
}


checkUserHosting();