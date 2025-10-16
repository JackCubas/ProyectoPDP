const express = require('express');
const morgan = require('morgan');
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
let connection;

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
            console.log(fields);

            let resultRows = Object.values(JSON.parse(JSON.stringify(result)));
            resultRows.forEach((v) => console.log(v));
        });
    });

} catch (error) {
    console.log("Error al conectar con la base de datos");
}

module.exports = {connection};

//---------------------------------------------------


//---------------------------------------------------    

app.set('view engine','ejs');
app.use(express.json());
//app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));


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

app.listen(APIPORT, () => {
  console.log(`Example app listening at http://localhost:${APIPORT}`);
});

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}