const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const app = express();

const DBPORT=3306
const DBHOST="127.0.0.1"
const DBUSER="root"
const DBPASS=""
const DBNAME="prueba_movie"
const APIPORT=3000

//-------------------------------------------------

//dotenv nos permite leer las variables de entorno de nuestro .env
const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql');

//---------------------------------------------------


//---------------------------------------------------    

app.set('view engine','ejs');
app.use(express.json());
//app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(cors());

//---------------------------------------------------
app.use((req, res, next) => {
    console.log('new request made:');
    //console.log('host: ', req.hostname);
    //console.log('path: ', req.path);
    //console.log('method: ', req.method);
    next();
});

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.get("/movies", cors(), (req, res) => {

  let connection;
  var resultRows;

  try {
      connection = mysql.createConnection({
          host: DBHOST,
          user: DBUSER,
          password: DBPASS,
          port     :DBPORT,
          database: DBNAME
      });

      connection.connect(function(err) {
          if (err) throw err;
          
          connection.query("SELECT * FROM movies", function (err, result, fields) {
              if (err) throw err;
              
              console.log(result);
              //console.log(fields);

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));
              //resultRows.forEach((v) => console.log(v));
              console.log(resultRows);
              res.json(resultRows);
          });
      });

  } catch (error) {
      console.log("Error al conectar con la base de datos");
  }

  //module.exports = {connection};
  //resultRows = emptyOrRows(resultRows);
  //connection.end();
  //res.json(resultRows);
  //res.json({ message: "ok" });
});

app.post('/create-movie', (req, res) => {

    let con;

    con = mysql.createConnection({
          host: DBHOST,
          user: DBUSER,
          password: DBPASS,
          port     :DBPORT,
          database: DBNAME
    });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    let sql = "INSERT INTO movies (prodId, price, quantity) VALUES ?";

    let values = [
      [req.body.prodId, req.body.price, req.body.quantity]
    ]

    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
    
  });
});

app.listen(APIPORT, () => {
  console.log(`Example app listening at http://localhost:${APIPORT}`);
});

//------------------------------------------------------
//------------------------------------------------------
//-----------------------------------------------------
//------------------------------------------------------

/*app.get('/add-movie', (req, res) => {
    
    .then((result) => {
        res.send(result)
    })
    .catch((err) =>{
        console.log(err)
    });
})

app.get('/all-movies', (req, res) => {

    .then((result) => {
        res.send(result)
    })
    .catch((err) =>{
        console.log(err)
    });
})

app.get('/one-movie', (req, res) => {
    
    .then((result) => {
        res.send(result)
    })
    .catch((err) =>{
        console.log(err)
    });
})*/

//---------------------------------------------------
//----------------------------------------------------
//----------------------------------------------------

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}