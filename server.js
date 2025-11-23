const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const app = express();

//-------------------------------------------------

//dotenv nos permite leer las variables de entorno de nuestro .env
const dotenv = require("dotenv");
dotenv.config();

const mysql = require('mysql2');

const DBPORT= process.env.DBPORT;
const DBHOST= process.env.DBHOST;
const DBUSER= process.env.DBUSER;
const DBPASS= process.env.DBPASS;
const DBNAME= process.env.DBNAME;
const APIPORT= process.env.APIPORT;
const CARPETAPDF= process.env.CARPETAPDF;

//---------------------------------------------------


//---------------------------------------------------    

app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(cors());

//---------------------------------------------------
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.json({limit: '50mb'}));

//----------------------------------
const fs = require('fs');
const fileUpload = require('express-fileupload');
const util = require("util");
//----------------------------------
const crypto = require("crypto")
//-------------------------------------------
app.use((req, res, next) => {
    console.log('new request made:');
    next();
});

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
//----------------------------------------------------------------------------------------
var key = Buffer.from('MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=', 'base64');

function encrypt(plaintext) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    key,
    iv
  );
  let encrypted = Buffer.concat([iv, cipher.update(plaintext, 'utf8'), cipher.final()]);
  return encrypted.toString('base64url');
}

function decrypt(ivCiphertextB64) {
  const ivCiphertext = Buffer.from(ivCiphertextB64, 'base64url');
  const iv = ivCiphertext.subarray(0, 16);
  const ciphertext = ivCiphertext.subarray(16);
  const cipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key,
    iv
  );
  let decrypted = Buffer.concat([cipher.update(ciphertext), cipher.final()]);
  return decrypted.toString('utf-8');
}
//------------------------------------------------------------------------------------

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

app.get('/users_pag', (req, res) => {
  console.log("get all users del paginacion!");

  const page = req.query.page;

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

          var sql = "SELECT * FROM users LIMIT 10";

          if(page > 1){
            sql = sql + " OFFSET " + ((page-1)*10);
          }
          console.log(sql);
          connection.query(sql, function (err, result, fields) {
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
        
        if(resultRows.length > 0){
          console.log(resultRows);
          resultFinal = resultRows[0];
          console.log(resultFinal);
          resultFinal.passUser = decrypt(resultFinal.passUser);
          console.log(resultFinal);
          resultRows[0] = resultFinal;
        }

        res.json(resultRows);
    });
    
  });
});


app.post('/users', (req, res) => {
    // simple validation
    const { nameUser, emailUser, passUser, rolUser, encryptKeyUser } = req.body || {};
    if (!nameUser || nameUser.trim().length < 2) return res.status(400).json({ error: 'Nombre requerido (min 2 chars)' });
    if (!emailUser || !/^\S+@\S+\.\S+$/.test(emailUser)) return res.status(400).json({ error: 'Mail valido requerido' });
    if (!passUser || passUser.length < 6) return res.status(400).json({ error: 'Contraseña requerida (min 6 chars)' });
    const allowedRoles = ['ADMIN', 'CLIENT', 'FIRMA'];
    if (!rolUser || !allowedRoles.includes(rolUser)) return res.status(400).json({ error: 'Rol invalido' });

    passEncrypt = encrypt(passUser);

    const con = mysql.createConnection({
          host: DBHOST,
          user: DBUSER,
          password: DBPASS,
          port     :DBPORT,
          database: DBNAME
    });

    con.connect(function(err) {
      if (err) {
        console.error('DB connect error:', err);
        return res.status(500).json({ error: 'database connection error' });
      }

      const sql = 'INSERT INTO users (nameUser, emailUser, passUser, rolUser, encryptKeyUser) VALUES ?';
      const values = [[nameUser.trim(), emailUser.trim(), passEncrypt, rolUser, encryptKeyUser || null]];

      con.query(sql, [values], function (err, result) {
        if (err) {
          console.error('DB insert error:', err);
          return res.status(500).json({ error: 'database insert error' });
        }
        return res.json(result);
      });
    });
});

app.put('/users/:id', (req, res) => {

  console.log("update user!");

    const { id } = req.params;
    const { nameUser, emailUser, passUser, rolUser, encryptKeyUser} = req.body;

    console.log(id + " - " + nameUser + " - " + emailUser + " - " + passUser);

    passEncrypt = encrypt(req.body.passUser);

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
      passUser = "${passEncrypt}",
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


app.get('/login', (req, res) => {
  const userEmail = req.query.email;
  const userPass = req.query.pass;

  if (!userEmail || !/^\S+@\S+\.\S+$/.test(userEmail) || !userPass) {
    return res.status(400).json({ error: 'email y contra son requeridos' });
  }

  console.log("email: " + userEmail + " userPass: " + userPass);

  const con = mysql.createConnection({
        host: DBHOST,
        user: DBUSER,
        password: DBPASS,
        port     :DBPORT,
        database: DBNAME
  });

  con.connect(function(err) {
    if (err) {
      console.error('DB connect error:', err);
      return res.status(500).json({ error: 'database connection error' });
    }

    const sql = 'SELECT * FROM users WHERE emailUser = ?';
    con.query(sql, [userEmail.trim()], function (err, result) {
        if (err) {
          console.error('DB query error:', err);
          return res.status(500).json({ error: 'database query error' });
        }

        const rows = Object.values(JSON.parse(JSON.stringify(result)));
        if (!rows || rows.length === 0){ 
          return res.json({ user: 'FALSE' });
        }

        if(rows.length > 0){
          console.log(rows);
          resultFinal = rows[0];
          console.log(resultFinal);
          passUserDecrypt = decrypt(resultFinal.passUser);

          if(!passUserDecrypt || passUserDecrypt != userPass){
            return res.json({ user: 'FALSE' });
          }else{
            rows[0] = resultFinal;
          }
        }

        return res.json({ user: rows });
    });
  });
});

app.get('/users/checkUserEMail/:email', (req, res) => {
  console.log("checking if user exists!");

  const { email } = req.params;

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

    let sql = "SELECT *  from users WHERE email = ?";

    let values = [
      [email]
    ]

    con.query(sql, [values], function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);

        resultRows = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(resultRows);
        res.json(result);
        
    });
    
  });


});

function userExistsByEmail(email){
  console.log("checking if user exists!");

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

    let sql = "SELECT *  from users WHERE email = ?";

    let values = [
      [email]
    ]

    con.query(sql, [values], function (err, result, fields) {
        if (err) throw err;
        
        console.log(result);

        resultRows = Object.values(JSON.parse(JSON.stringify(result)));
        console.log(resultRows);

        if(resultRows.length == 0){
          console.log("user does not exists!");
          return false;
        }else{
          console.log("user does exists!");
          return true;
        }
        
    });
    
  });
}

//----------------------------------------------------------------//-----------------------
app.listen(APIPORT, () => {
  console.log(`Example app listening at http://localhost:${APIPORT}`);
});

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

//------------------------

