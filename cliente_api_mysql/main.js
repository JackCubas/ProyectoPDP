const URLSERVER = "http://localhost:3000/movies";

const llamandoAPI = async () => {
  try {
    const respuesta = await fetch(URLSERVER)

    const data =  respuesta.json()
    console.log(data)

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
llamandoAPI()
//fetchMovies();