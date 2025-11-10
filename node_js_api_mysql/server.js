const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const app = express();

/*const DBPORT=3306
const DBHOST="127.0.0.1"
const DBUSER="root"
const DBPASS=""
const DBNAME="prueba_movie"
const APIPORT=3000*/

//-------------------------------------------------

//dotenv nos permite leer las variables de entorno de nuestro .env
const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql');

const DBPORT= process.env.DBPORT;
const DBHOST= process.env.DBHOST;
const DBUSER= process.env.DBUSER;
const DBPASS= process.env.DBPASS;
const DBNAME= process.env.DBNAME;
const APIPORT= process.env.APIPORT;

//---------------------------------------------------


//---------------------------------------------------    

app.set('view engine','ejs');
app.use(express.json());
//app.use(express.static('public'));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(cors());

//---------------------------------------------------
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.json({limit: '50mb'}));


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

  console.log("get all movie!");

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

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));
              console.log(resultRows);
              res.json(resultRows);
          });
      });

  } catch (error) {
      console.log("Error al conectar con la base de datos");
  }

});

app.get("/get-movie/:id", async(req, res) => {

  console.log("get movie!");

  let con;
  var resultRows;
  const { id } = req.params;

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

    let sql = "SELECT *  from movies WHERE prodId = ?";

    let values = [
      [id]
    ]

    con.query(sql, [values], function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);

        resultRows = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(resultRows);
        res.json(resultRows);
    });
    
  });
    
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
      console.log(result);

      res.json(result);
    });
    
  });
});

app.delete('/delete-movie/:id', (req, res) => {

    console.log("delete movie!");

    let con;
    const { id } = req.params;

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

    let sql = "DELETE FROM movies WHERE prodId = ?";

    let values = [
      [id]
    ]

    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
      console.log(result);

      res.json(result);
    });
    
  });
});


app.put('/update-movie/:id', (req, res) => {

    console.log("update movie!");

    const { id } = req.params;
    const { price, quantity} = req.body;

    console.log(id + " - " + price + " - " + quantity);

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

    let sql = `
      UPDATE movies 
      SET price = "${price}", 
      quantity = "${quantity}" 
      WHERE prodId = "${id}"
    `;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record modified");
      console.log(result);

      res.json(result);
    });
    
  });
});

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------


app.get("/pdfs", cors(), (req, res) => {

   console.log("get all pdfs!");

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
          
        //SELECT id, name, CONCAT('data:image/jpeg;base64,', CAST(blob_data AS CHAR CHARSET utf8mb4)) AS base64_data FROM blob_table;
        //SELECT id, name, TO_BASE64(blob_data) AS base64_data FROM pdfs
          connection.query("SELECT id, name, docBlob FROM pdfs", function (err, result, fields) {
              if (err) throw err;
              
              console.log(result);

              //result.docBlob = new Blob([result.docBlob], {
              //    type: "application/pdf",
              //});

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));
              console.log(resultRows);
              res.json(resultRows);
          });
      });

  } catch (error) {
      console.log("Error al conectar con la base de datos");
  }

});


app.post('/create-pdf', (req, res) => {

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
    console.log("Connected to pdf!");

    let sql = "INSERT INTO pdfs (name, docBlob) VALUES ?";

    let values = [
      [req.body.name, req.body.docBlob]
    ]

    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted into pdf");
      console.log(result);

      res.json(result);
    });
    
  });
});

//--------------------------
//--------------------------
//--------------------------
app.get('/users', (req, res) => {
  console.log("get all users!");

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
          
          connection.query("SELECT * FROM users", function (err, result, fields) {
              if (err) throw err;
              
              console.log(result);

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));
              console.log(resultRows);
              res.json(resultRows);
          });
      });

  } catch (error) {
      console.log("Error al conectar con la base de datos");
  }
});

app.get('/users/:id', (req, res) => {
    console.log("get user!");

  let con;
  var resultRows;
  const { id } = req.params;

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

    let sql = "SELECT *  from users WHERE id = ?";

    let values = [
      [id]
    ]

    con.query(sql, [values], function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);

        resultRows = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(resultRows);
        res.json(resultRows);
    });
    
  });
});


app.post('/users', (req, res) => {
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

    let sql = "INSERT INTO users (nameUser, emailUser, passUser, rolUser, encryptKeyUser) VALUES ?";

    let values = [
      [req.body.nameUser, req.body.emailUser, req.body.passUser, req.body.rolUser, req.body.encryptKeyUser]
    ]

    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      console.log(result);

      res.json(result);
    });
    
  });
});

app.put('/users/:id', (req, res) => {

  console.log("update user!");

    const { id } = req.params;
    const { nameUser, emailUser, passUser, rolUser, encryptKeyUser} = req.body;

    console.log(id + " - " + nameUser + " - " + emailUser);

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

    let sql = `
      UPDATE users 
      SET nameUser = "${nameUser}", 
      emailUser = "${emailUser}",
      passUser = "${passUser}",
      rolUser = "${rolUser}",
      encryptKeyUser = "${encryptKeyUser}" 
      WHERE id = "${id}"
    `;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record modified");
      console.log(result);

      res.json(result);
    });
    
  });
    
});

app.delete('/users/:id', (req, res) => {
    console.log("delete user!");

    let con;
    const { id } = req.params;

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

    let sql = "DELETE FROM users WHERE id = ?";

    let values = [
      [id]
    ]

    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
      console.log(result);

      res.json(result);
    });
    
  });
});

app.post('/users/login', (req, res) => {
  console.log("get user login!");

  let con;
  var resultRows;
  
  /*let values = [
      [req.body.emailUser, req.body.passUser]
    ]*/

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

    let sql = `
      SELECT * FROM users WHERE 
      emailUser = "${req.body.emailUser}" 
      AND passUser = "${req.body.passUser}"
    `;

    console.log(sql);

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);

        resultRows = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(resultRows);

        if(resultRows.length == 0){
          console.log("user does not exists!");
          res.json({"user": false});
        }

        if(resultRows.length > 0 && resultRows[0].rolUser == "ADMIN"){
          console.log("user exists and is ADMIN!");
          res.json({"user": "ADMIN"});
        }

        if(resultRows.length > 0 && resultRows[0].rolUser == "CLIENT"){
          console.log("user exists and is CLIENT!");
          res.json({"user": "CLIENT"});
        }
        
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