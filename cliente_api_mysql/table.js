const URLSERVER = "http://localhost:3000/movies";

function checkUserHosting() {
    return fetch(URLSERVER)
        .then((response) => { 
            return response.json().then((data) => {
                //return appendData(data);
                return buildTable(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

function buildTable(data) {
  console.log(data);
  const table = document.getElementById("mytable").getElementsByTagName('tbody')[0];
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]);

    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    cell1.textContent = data[i].prodId;

    const button = document.createElement('button');
    button.id = "testbutton" + i;
    button.textContent = "Click Me";
    button.addEventListener('click', doSmth);
    cell2.appendChild(button);
    
    const butID = data[i].prodId;

    const buttonEdit = document.createElement('button');
    buttonEdit.id = "editbutton" + butID;
    buttonEdit.textContent = "Edit";
    buttonEdit.addEventListener('click', edit);
    cell2.appendChild(buttonEdit);

    const buttonSave = document.createElement('button');
    buttonSave.id = "savebutton" + butID;
    buttonSave.textContent = "Save";
    buttonSave.addEventListener('click', save);
    cell2.appendChild(buttonSave);

    const buttonDel = document.createElement('button');
    buttonDel.id = "delbutton" + butID;
    buttonDel.textContent = "Delete";
    buttonDel.addEventListener('click', del);
    cell2.appendChild(buttonDel);
  }
}

function doSmth(event) {
  alert(event.target.id);
}

function edit(event){
  console.log("EDIT");
  alert("EDIT" + event.target.id);

  //window.location.href = "modify.html";
}

function del(event){
  console.log("DELETE");
  alert("DELETE" + event.target.id);

  //window.location.href = "delete.html";
}

function save(event){
  console.log("SAVE");
  alert("SAVE" + event.target.id);


  //window.location.href = "modify.html";
}

dataHosting = checkUserHosting();
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------


//------------------------
//------------------------


/*function appendData(data){
        var con=document.getElementById("main-container")

        for(let i=0;i<data.length;i++){
            var d=document.createElement("div")

            console.log(data[i]);
            console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");

            d.textContent="ProdID: " + data[i].prodId
            d.innerHTML = d.innerHTML + "<td>";
            d.innerHTML = d.innerHTML + '<input type="button" id="edit_button3" value="Edit" class="edit" onclick="edit()">';
            d.innerHTML = d.innerHTML + '<input type="button" id="save_button3" value="Save" class="save" onclick="save()">';
            d.innerHTML = d.innerHTML + '<input type="button" value="Delete" class="delete" onclick="del()">';
            d.innerHTML = d.innerHTML + "</td>";
            con.appendChild(d);


            //var id=data[i].prodId;
            //d.textContent="ProdID: " + data[i].prodId

            //d.innerHTML = d.innerHTML + "<td>";
            //d.innerHTML = d.innerHTML + "<input type='text' onclick='edit()' id='edit_button_"+id+"' value='Edit'>";
            //d.innerHTML = d.innerHTML + "<input type='text' onclick='del()' id='delete_button_"+id+"' value='Delete'>";
            //d.innerHTML = d.innerHTML + "</td>";
            //con.appendChild(d);

            //var row = table.insertRow(table_len).outerHTML="<tr id='row"+id+"'><td id='name_val"+id+"'>"+name+"</td><td id='age_val"+id+"'>"+age+"</td><td><input type='button' class='edit_button' id='edit_button"+id+"' value='edit' onclick='edit_row("+id+");'/><input type='button' class='save_button' id='save_button"+id+"' value='save' onclick='save_row("+id+");'/><input type='button' class='delete_button' id='delete_button"+id+"' value='delete' onclick='delete_row("+id+");'/></td></tr>";


        }
}*/

/*function RoomIsReadyFunc(ID, RefId, YourString)
{
  alert(ID);
  alert(RefId);
  alert(YourString);
}*/


//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------

//WIP

/*const llamandoAPI = async () => {
  try {
    const respuesta = await fetch(URLSERVER)

    const dataDevuelto =  respuesta.json()
                          .then((data) => {
                              console.log(data);
                              return data;
                          });

  } catch (error) {
    console.log(error);
  } 
}*/

/*const fetchMovies = async () => {
  try {
    const response = await fetch(URLSERVER);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const movies = await response.json(); // Parse JSON data
    console.log(movies);
  } catch (error) {
    console.error('Error fetching movies:', movies);
  }
};*/

/*const llamandoConsole = () => {
  console.log('Hello World')
}*/

//llamandoConsole();
//llamandoAPI();
//fetchMovies();

