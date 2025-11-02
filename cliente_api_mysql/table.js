const URLSERVER = "http://localhost:3000/movies";

function checkUserHosting() {
    return fetch(URLSERVER)
        .then((response) => { 
            return response.json().then((data) => {
                console.log(data);
                //return data;
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

function appendData(data){
        var con=document.getElementById("main-container")
        for(let i=0;i<data.length;i++){
            var d=document.createElement("div")
            d.textContent="ProdID: " + data[i].prodId
            //add the data in whatever html element you want and then append it to the container
            d.innerHTML = d.innerHTML + " ";
            d.innerHTML = d.innerHTML + '<a onclick="edit('+ data[i] +')" class="btn btn-primary">Edit</a>';
            d.innerHTML = d.innerHTML + " ";
            d.innerHTML = d.innerHTML + '<a onclick="del(' + data[i] +')" class="btn btn-primary">Delete</a>';
            
            con.appendChild(d);
        }
}

function edit(data){
  console.log("EDIT");
  console.log(data);

  //window.location.href = "modify.html";
}

function del(data){
  console.log("DELETE");
  console.log(data);

  //window.location.href = "delete.html";
}


//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------
//-------------------------------------------------------------

//WIP

const llamandoAPI = async () => {
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
}

const fetchMovies = async () => {
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
};

const llamandoConsole = () => {
  console.log('Hello World')
}

//llamandoConsole();
dataHosting = checkUserHosting();
console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")
//console.log(dataHosting);
console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")

//llamandoAPI();
//fetchMovies();

