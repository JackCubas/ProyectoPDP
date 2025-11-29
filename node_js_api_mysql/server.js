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
//app.use(express.json());
//app.use(express.static('public'));
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
const pdfParse = require('pdf-parse');

//---------------------------------

//const PDFParser = require('pdf-parse');

//const uploadDirectory = CARPETAPDF;
//const multer = require('multer');
//const path = require('path');
//const mammoth = require('mammoth');

//var multer = require('multer');
//var upload = multer({dest: uploadDirectory});


//const FormData = require('form-data');
//-------------------------------------------

/*const storage = multer.diskStorage({
       destination: (req, file, cb) => {
          cb(null, CARPETAPDF + '/');
       },
       filename: (req, file, cb) => {
          cb(null, file.originalname);
       }
});
const upload = multer({ storage });*/



// Function to process the file data (perform your file processing logic here)
/*function processFileData(fileData) {
  fs.writeFile('output.txt', fileData, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
      });
}*/


//------------------------------------


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


//--------------------------
//--------------------------
//--------------------------

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

async function computePdfMetadata(filePath){
  try{
    const buffer = fs.readFileSync(filePath);
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    let numPages = 0;
    try{
      const data = await pdfParse(buffer);
      numPages = data && data.numpages ? data.numpages : 0;
    }catch(err){
      console.error('pdf-parse error:', err);
    }
    const uploadTimestamp = new Date();
    return { fileSize, numPages, sha256: hash, uploadTimestamp };
  }catch(err){
    console.error('computePdfMetadata error:', err);
    return { fileSize: 0, numPages: 0, sha256: null, uploadTimestamp: new Date() };
  }
}



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
              
              //console.log(result);

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));
              //console.log(resultRows);
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
              
              //console.log(result);

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));
              //console.log(resultRows);
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
        
        //console.log(result);

        resultRows = Object.values(JSON.parse(JSON.stringify(result)));
        
        if(resultRows.length > 0){
          //console.log(resultRows);
          resultFinal = resultRows[0];
          //console.log(resultFinal);
          resultFinal.passUser = decrypt(resultFinal.passUser);
          //console.log(resultFinal);
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

//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------


app.get("/pdfs", cors(), (req, res) => {

  //console.log("get all pdfs!");

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
        //SELECT id, userId, name, urlCarpeta FROM pdfs
          var queryBusqueda = "SELECT pdfs.id as pdfId, pdfs.name AS DocName, urlCarpeta, estado, nameUser, userId FROM pdfs INNER JOIN users ON pdfs.userId = users.id"
          connection.query(queryBusqueda, function (err, result, fields) {
              if (err) throw err;
              
              //console.log(result);

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));

              //var carpetUrl = resultRows[0].urlCarpeta;

              //console.log(resultRows);
              res.json(resultRows);
          });
      });

  } catch (error) {
      console.log("Error al conectar con la base de datos");
  }

});

app.get("/pdfsByUser/:userId", cors(), (req, res) => {

   console.log("get all pdfs for user!");

  let connection;
  var resultRows;
  const { userId } = req.params;

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

          var sql = "SELECT id, userId, name, estado, urlCarpeta FROM pdfs WHERE userId = ?";

          let values = [
            [userId]
          ]

          connection.query(sql,[values], function (err, result, fields) {
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

app.get("/pdfs/:id", cors(), (req, res) => {

  //console.log("get pdf by id!");

  let connection;
  var resultRows;
  const { id } = req.params;

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

          //var sql = "SELECT id, userId, name, urlCarpeta FROM pdfs WHERE id = ?";
          var queryBusqueda = "SELECT pdfs.id as pdfId, pdfs.name AS DocName, urlCarpeta, nameUser, estado, userId FROM pdfs INNER JOIN users ON pdfs.userId = users.id WHERE pdfs.id = ?"

          let values = [
            [id]
          ]

          connection.query(queryBusqueda,[values], function (err, result, fields) {
              if (err) throw err;
              
              //console.log(result);

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));

              //console.log(resultRows);
              res.json(resultRows);
          });
      });

  } catch (error) {
      console.log("Error al conectar con la base de datos");
  }

});

//------------------
//------------------
app.post('/create-pdf', fileUpload(), async (req, res) => {

  console.log("llegado al create-pdf: " + req.body.estado); 
  const pdfFile = req.files && req.files.uploadedFile ? req.files.uploadedFile : null;
  const nombreFile = req.body.filename;
  const estado = req.body.estado || 'PENDING';
  //const estado = req.body.estado;
  const archivoNombre = CARPETAPDF + "/" + nombreFile + '.pdf';

  if(!pdfFile){
    return res.status(400).json({ error: 'No uploadedFile provided' });
  }

  try{
    fs.writeFileSync(archivoNombre, pdfFile.data);
    console.log('File written successfully', archivoNombre);

    // compute metadata
    const metadata = await computePdfMetadata(archivoNombre);

    //-------------------------------
    console.log("llegado a la base de datos"); 
    let con;

    con = mysql.createConnection({
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
      console.log("Connected to pdf!");
      console.log(req.body);

      let sql = "INSERT INTO pdfs (userId, name, urlCarpeta, estado, fileSize, numPages, sha256, uploadTimestamp) VALUES ?";

      let values = [
        [req.body.userId, nombreFile, archivoNombre, estado, metadata.fileSize, metadata.numPages, metadata.sha256, metadata.uploadTimestamp]
      ]

      con.query(sql, [values], function (err, result) {
        if (err) {
          console.error('DB insert error:', err);
          return res.status(500).json({ error: 'database insert error' });
        }
        console.log("1 record inserted into pdf");
        console.log(result);

        res.json(result);
      });
      
    });

  }catch(err){
    console.error('create-pdf error:', err);
    return res.status(500).json({ error: 'failed to save or process pdf' });
  }
});


//-------------------
//-------------------

app.get('/retrieve/:thisDocName', function(req, res) {
  const { thisDocName } = req.params;
  
  const pathAxios = CARPETAPDF + "/" + thisDocName + '.pdf'; // path where to file is stored in server

  if (fs.existsSync(pathAxios)) {
    //console.log("llegado al retrieve puro");
    const rs = fs.createReadStream(pathAxios);

    // get size of the video file
    const { size } = fs.statSync(pathAxios);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", size);
    rs.pipe(res);
  }else{
    return res.status(500).json({ error: 'database connection error' });
  }
  
})


app.delete('/eliminate', async function(req, res) {

  const id = req.query.id;
  const docName = req.query.docName;

  if (!id || !docName) {
    return res.status(400).json({ id: 'email y docName son requeridos' });
  }

  console.log("id: " + id + " docName: " + docName);
  console.log("llegado al delete pdf para doc nombre " + docName);

  //------------------------------------------------

  console.log("llegado al delete pdf puro");
  const pathAxios = CARPETAPDF + "/" + docName  +".pdf";

  if (fs.existsSync(pathAxios)) {
    // delete the file on server after it sends to client
    const unlinkFile = util.promisify(fs.unlink); // to del file from local storage
    unlinkFile(pathAxios);
  }

  //-----------------------------------------------

  console.log("delete pdf from bbdd!");

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

    let sql = "DELETE FROM pdfs WHERE id = ?";

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

})


// Validation endpoint: only FIRMA role can validate a PDF.
app.put('/pdfs/:id/validate', async (req, res) => {
  const { id } = req.params;
  const actionRaw = (req.body && req.body.action) ? String(req.body.action) : 'VALIDATE';
  const action = actionRaw.toUpperCase().trim(); // expected 'VALIDATE'

  // Validator identity must be provided in headers
  const headerUserId = req.headers['x-user-id'];
  const headerUserRoleRaw = req.headers['x-user-role'];
  const headerUserRole = headerUserRoleRaw ? String(headerUserRoleRaw).toUpperCase().trim() : null;

  if (!headerUserId || !headerUserRole) return res.status(401).json({ error: 'validator identity required (x-user-id and x-user-role headers)' });
  if (headerUserRole !== 'FIRMA') return res.status(403).json({ error: 'only FIRMA role can validate' });

  // fetch pdf metadata from DB
  const con = mysql.createConnection({
    host: DBHOST,
    user: DBUSER,
    password: DBPASS,
    port: DBPORT,
    database: DBNAME
  });

  con.connect(function(err) {
    if (err) { console.error('DB connect error:', err); return res.status(500).json({ error: 'database connection error' }); }

    con.query('SELECT * FROM pdfs WHERE id = ?', [[id]], async function(err, result){
      if (err) { console.error('DB select error:', err); return res.status(500).json({ error: 'database query error' }); }
      const rows = Object.values(JSON.parse(JSON.stringify(result)));
      if(!rows || rows.length === 0) return res.status(404).json({ error: 'pdf not found' });

      const row = rows[0];
      const filePath = row.urlCarpeta || (CARPETAPDF + '/' + row.name + '.pdf');

      if(!fs.existsSync(filePath)) return res.status(400).json({ error: 'file missing on server' });

      try{
        const buffer = fs.readFileSync(filePath);
        const currentHash = crypto.createHash('sha256').update(buffer).digest('hex');

        // Check integrity
        if(!row.sha256 || row.sha256 !== currentHash){
          return res.status(400).json({ error: 'file integrity check failed (hash mismatch)' });
        }

        // Check modification time: prevent validation if file changed after upload
        const stats = fs.statSync(filePath);
        const mtimeMs = stats.mtimeMs;
        const uploadTsMs = row.uploadTimestamp ? new Date(row.uploadTimestamp).getTime() : null;
        if(uploadTsMs && mtimeMs > uploadTsMs + 1000){
          return res.status(400).json({ error: 'file was modified after upload; validation prevented' });
        }

        // determine state value (always VALIDATED here)
        const newEstado = 'VALIDATED';
        const validationTimestamp = new Date();

        const updateSql = `UPDATE pdfs SET estado = ?, validatorId = ?, validationTimestamp = ? WHERE id = ?`;
        const params = [newEstado, headerUserId, validationTimestamp, id];

        con.query(updateSql, params, function(err, updateResult){
          if(err){ console.error('DB update error:', err); return res.status(500).json({ error: 'database update error' }); }
          return res.json({ success: true, estado: newEstado, validatorId: headerUserId, validationTimestamp });
        });

      }catch(err){
        console.error('validation error:', err);
        return res.status(500).json({ error: 'validation failed' });
      }
    });
  });

});

// Explicit rejection endpoint: forces REJECTED state (only FIRMA role)
app.put('/pdfs/:id/reject', async (req, res) => {
  const { id } = req.params;

  // Validator identity must be provided in headers (normalize role)
  const headerUserId = req.headers['x-user-id'];
  const headerUserRoleRaw = req.headers['x-user-role'];
  const headerUserRole = headerUserRoleRaw ? String(headerUserRoleRaw).toUpperCase().trim() : null;

  if (!headerUserId || !headerUserRole) return res.status(401).json({ error: 'validator identity required (x-user-id and x-user-role headers)' });
  if (headerUserRole !== 'FIRMA') return res.status(403).json({ error: 'only FIRMA role can reject' });

  // fetch pdf metadata from DB
  const con = mysql.createConnection({
    host: DBHOST,
    user: DBUSER,
    password: DBPASS,
    port: DBPORT,
    database: DBNAME
  });

  con.connect(function(err) {
    if (err) { console.error('DB connect error:', err); return res.status(500).json({ error: 'database connection error' }); }

    con.query('SELECT * FROM pdfs WHERE id = ?', [[id]], async function(err, result){
      if (err) { console.error('DB select error:', err); return res.status(500).json({ error: 'database query error' }); }
      const rows = Object.values(JSON.parse(JSON.stringify(result)));
      if(!rows || rows.length === 0) return res.status(404).json({ error: 'pdf not found' });

      const row = rows[0];
      const filePath = row.urlCarpeta || (CARPETAPDF + '/' + row.name + '.pdf');

      if(!fs.existsSync(filePath)) return res.status(400).json({ error: 'file missing on server' });

      try{
        const buffer = fs.readFileSync(filePath);
        const currentHash = crypto.createHash('sha256').update(buffer).digest('hex');

        // Check integrity
        if(!row.sha256 || row.sha256 !== currentHash){
          return res.status(400).json({ error: 'file integrity check failed (hash mismatch)' });
        }

        // Check modification time: prevent rejection if file changed after upload
        const stats = fs.statSync(filePath);
        const mtimeMs = stats.mtimeMs;
        const uploadTsMs = row.uploadTimestamp ? new Date(row.uploadTimestamp).getTime() : null;
        if(uploadTsMs && mtimeMs > uploadTsMs + 1000){
          return res.status(400).json({ error: 'file was modified after upload; rejection prevented' });
        }

        const newEstado = 'REJECTED';
        const validationTimestamp = new Date();

        const updateSql = `UPDATE pdfs SET estado = ?, validatorId = ?, validationTimestamp = ? WHERE id = ?`;
        const params = [newEstado, headerUserId, validationTimestamp, id];

        con.query(updateSql, params, function(err, updateResult){
          if(err){ console.error('DB update error:', err); return res.status(500).json({ error: 'database update error' }); }
          return res.json({ success: true, estado: newEstado, validatorId: headerUserId, validationTimestamp });
        });

      }catch(err){
        console.error('rejection error:', err);
        return res.status(500).json({ error: 'rejection failed' });
      }
    });
  });
});

app.put('/modify-pdf/:id', fileUpload(), async (req, res) => {

  console.log("llegado al modify-pdf" + req.body.estado);
  console.log(req.files);



  const { id } = req.params;

  const nombreFileNuevo = req.body.filename;
  const nombreFileOriginal = req.body.filenameOriginal;
  const estado = req.body.estado || 'PENDING';
  const userId = req.body.userId;

  const archivoNombreNuevo = CARPETAPDF + "/" + nombreFileNuevo + '.pdf';
  const archivoNombreOriginal = CARPETAPDF + "/" + nombreFileOriginal + '.pdf';
  
  var pdfFile = (req.files && req.files.uploadedFile) ? req.files.uploadedFile : null;

  console.log(id, archivoNombreNuevo, archivoNombreOriginal, nombreFileOriginal, nombreFileNuevo, estado, userId, !!pdfFile);

  try{
    if(pdfFile === null){
      // rename file
      if (fs.existsSync(archivoNombreOriginal)){
        fs.renameSync(archivoNombreOriginal, archivoNombreNuevo);
        console.log('The file has been re-named to: ' + archivoNombreNuevo);
      }else{
        console.warn('Original file not found for rename:', archivoNombreOriginal);
      }
    } else {
      // replace file
      if (fs.existsSync(archivoNombreOriginal)) {
        const unlinkFile = util.promisify(fs.unlink);
        await unlinkFile(archivoNombreOriginal);
      }
      fs.writeFileSync(archivoNombreNuevo, pdfFile.data);
      console.log('File written successfully:', archivoNombreNuevo);
    }

    // compute metadata for the new file
    const metadata = await computePdfMetadata(archivoNombreNuevo);

    //-----------------------------------
    con = mysql.createConnection({
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
      console.log("Connected!");

      // Format uploadTimestamp for MySQL DATETIME
      const uploadTs = metadata.uploadTimestamp.toISOString().slice(0, 19).replace('T', ' ');

      let sql = `
        UPDATE pdfs 
        SET userId = "${userId}", 
        name = "${nombreFileNuevo}",
        urlCarpeta = "${archivoNombreNuevo}",
        estado = "${estado}",
        fileSize = ${metadata.fileSize},
        numPages = ${metadata.numPages},
        sha256 = "${metadata.sha256}",
        uploadTimestamp = "${uploadTs}"
        WHERE id = "${id}"
      `;
      con.query(sql, function (err, result) {
        if (err) {
          console.error('DB update error:', err);
          return res.status(500).json({ error: 'database update error' });
        }
        console.log("1 record modified");
        console.log(result);

        res.json(result);
      });

    })
  }catch(err){
    console.error('modify-pdf error:', err);
    return res.status(500).json({ error: 'failed to modify pdf' });
  }
})

//-----------------------
app.listen(APIPORT, () => {
  console.log(`Firma app listening at http://localhost:${APIPORT}`);
});

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}


//---------------------
//--------------------

/*app.put('/modify-pdf/:id', fileUpload(), (req, res) => {

  console.log("llegado al modify-pdf");
  
  console.log(req.files);

  const { id } = req.params;

  const nombreFileNuevo = req.body.filename;
  const nombreFileOriginal = req.body.filenameOriginal;
  const estado = req.body.estado;
  const userId = req.body.userId;

  const archivoNombreNuevo = CARPETAPDF + "/" + nombreFileNuevo + '.pdf';
  const archivoNombreOriginal = CARPETAPDF + "/" + nombreFileOriginal + '.pdf';
  
  var pdfFile;
  if(req.files != null){
    pdfFile = req.files.uploadedFile;
  }else{
    pdfFile = null;
  }

  console.log(id);
  console.log(archivoNombreNuevo);
  console.log(archivoNombreOriginal);
  console.log(nombreFileOriginal);
  console.log(nombreFileNuevo);
  console.log(estado);
  console.log(userId);
  console.log(pdfFile);

  if(pdfFile === null){

    fs.rename(archivoNombreOriginal, archivoNombreNuevo, function (err) {
      if (err) {console.log(err); return; }
      
        console.log('The file has been re-named to: ' + archivoNombreNuevo);
      })

  }
  
  if(pdfFile !== null && pdfFile.data !== null){

    if (fs.existsSync(archivoNombreOriginal)) {
      // delete the file on server after it sends to client
      const unlinkFile = util.promisify(fs.unlink); // to del file from local storage
      unlinkFile(archivoNombreOriginal);
    }

    fs.writeFileSync(archivoNombreNuevo, pdfFile.data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });

  }


  //-----------------------------------

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
      UPDATE pdfs 
      SET userId = "${userId}", 
      name = "${nombreFileNuevo}",
      urlCarpeta = "${archivoNombreNuevo}",
      estado = "${estado}"
      WHERE id = "${id}"
    `;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record modified");
      console.log(result);

      res.json(result);
    });

  })
})*/

//------------------------
//-----------------------

/*app.post('/users/login', (req, res) => {
  console.log("get user login!");

  let con;
  var resultRows;

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
          res.json({user: "FALSE"});
        }

        if(resultRows.length > 0 && resultRows[0].rolUser == "ADMIN"){
          console.log("user exists and is ADMIN!");
          res.json({user: resultRows});
        }

        if(resultRows.length > 0 && resultRows[0].rolUser == "CLIENT"){
          console.log("user exists and is CLIENT!");
          res.json({user: resultRows});
        }

        if(resultRows.length > 0 && resultRows[0].rolUser == "FIRMA"){
          console.log("user exists and is FIRMA!");
          res.json({user: resultRows});
        }
        
    });
    
  });
});*/

/*app.delete('/eliminate', function(req, res) {

  console.log("llegado al delete pdf puro");
  const pathAxios = CARPETAPDF + "/" + 'output.pdf';
  // delete the file on server after it sends to client
  const unlinkFile = util.promisify(fs.unlink); // to del file from local storage
  unlinkFile(pathAxios);

})*/

/*app.get('/retrieve', function(req, res) { 
  const pathAxios = CARPETAPDF + "/" + 'output.pdf'; // path where to file is stored in server

  console.log("llegado al retrieve puro");
  const rs = fs.createReadStream(pathAxios);

  // get size of the video file
  const { size } = fs.statSync(pathAxios);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", size);
  rs.pipe(res);
  
})*/

/*app.post('/create-pdf', (req, res) => {

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
    console.log(req.body);

    let sql = "INSERT INTO pdfs (userId, name, urlCarpeta) VALUES ?";

    var urlCarpeta = CARPETAPDF + "/" + req.body.name + ".pdf";
    var datosPDF = req.body.docDatos;

    console.log(urlCarpeta);
    //console.log(datosPDF);

    //if(datosPDF){
    //  console.log(datosPDF);
    //  console.log("procesando");
    //  var base64Data = datosPDF.replace("data:application/pdf;base64,", "");
    //  //require("fs").writeFile(urlCarpeta, base64Data, 'base64',
    //  require("fs").writeFileSync(urlCarpeta, base64Data, 'base64', function(err) {
    /7    console.log("error");
    //    console.log(err);
    //  });
    //}

    let values = [
      [req.body.userId, req.body.name, urlCarpeta]
    ]

    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted into pdf");
      console.log(result);

      res.json(result);
    });
    
  });
});*/

/*app.post('/upload', fileUpload(), function(req, res) { 
  console.log("llegado al upload puro"); 
  const sampleFile = req.files.uploadedFile;
  const nombreFile = req.body.filename;
  const archivoNombrePrueba = CARPETAPDF + "/" + 'output.pdf';

  //console.log(req);
  console.log(sampleFile);
  console.log(nombreFile);

  fs.writeFileSync(archivoNombrePrueba, sampleFile.data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
  });

  res.send('File uploaded puro');
})*/

/*

let formData = {
        files: {
            value: fs.createReadStream(filePath),
            options: {
                filename: 'test.docx'
            }
        }
      };

*/

/*

const FormData = require('form-data'); 
const form = new FormData();
form.append('file', fs.createReadStream(filepath), {filename: 'newname'});

*/
//-----------------------
//-----------------------


//---------------


/*

app.post('/upload', fileUpload(), function(req, res) { 
  console.log("llegado al upload"); 
  const sampleFile = req.files.uploadedFile;
  const nombreFile = req.body.filename;
  const archivoNombrePrueba = CARPETAPDF + "/" + 'output.pdf';
  console.log(nombreFile);

  fs.writeFileSync(archivoNombrePrueba, sampleFile.data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
  });

  res.send({'File uploaded'});
})


*/


/*

app.get('/retrieve', function(req, res) { 
  console.log("llegado al retrieve");
  
  const archivoNombrePruebaRetrieve = CARPETAPDF + "/" + 'output.pdf'; 
  var formData = new FormData();
  var fileData;

  if (fs.existsSync(archivoNombrePruebaRetrieve)) {

    //'ascii', 'base64', 'binary', 'utf8'
    //const fileData = fs.readFileSync(filePath);
    //const buffer = Buffer.from(fileData, "binary");
    fs.readFileSync(archivoNombrePruebaRetrieve, (err, data) => {
      console.log("leyendo archivo");

      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      console.log('File contents:', data.toString());

    });

    const stringData = new FormData();
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
    fs.readFileSync(archivoNombrePruebaRetrieve, (error, data) => {  
      if (error) console.log(error)  
      if (data) {    
        // append key-value pair of a file name and the file
        // note that file should be File or Blob object
        stringData.append('strings-file', data) 
      }
      console.log('data type =', typeof stringData, '\n', stringData)
    })
    console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

    fileData = fs.readFileSync(archivoNombrePruebaRetrieve);
    //const buffer = Buffer.from(fileData, "binary");
    //console.log(buffer);
  }

  console.log(fileData);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
  return res.status(200).send(fileData);


  //res.type('application/pdf');
  //res.type('application/json');
  //res.header('Content-Disposition', 'attachment; filename="output.pdf"');
  //res.send(Buffer.from(fileData, 'base64'));

  formData.append("docName", 'output.pdf');
  formData.append("uploadedFile", fileData);
  //var jsonFormData = JSON.stringify(formData);
  console.log(formData);
  res.json(formData);
      
  // Stream res directly
  //fileData.body.pipe(res);


  //console.log("finalizado retrieve");
  //console.log(formData);
  //var jsonFormData = JSON.stringify(formData);
  //console.log(jsonFormData);
  //res.json(jsonFormData);

  //request.end();


  //const file_blob = new Blob([fileData], { type: "binary" })
  //formData.append('file', file_blob, 'output.pdf')

  //var form = new formdata();
  //form.append('docName', 'output.pdf');
  //form.append('docData', fileData);
})

*/

/*app.get('/download', function (req, res) {
  var options = {
    method: 'GET',
    host: 'localhost',
    port: port,
    path: '/file'
  };

  var request = http.request(options, function(response) {
    var data = [];

    response.on('data', function(chunk) {
      data.push(chunk);
    });

    response.on('end', function() {
      data = Buffer.concat(data);
      console.log('requested content length: ', response.headers['content-length']);
      console.log('parsed content length: ', data.length);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=working-test.pdf',
        'Content-Length': data.length
      });
      res.end(data);
    });
  });

  request.end();
});*/


/*app.post('/upload', upload.single('file'), async (req, res) => {
    var filePath = CARPETAPDF + "/" + "document" + ".pdf";
    var filePrueba = req.file;
    console.log(filePrueba);

    try {
        // Check if a file was uploaded
        if (!filePrueba) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(filePrueba);

        // Retrieve the uploaded file from the request body
        const uploadedFile = filePrueba;

        // Write the file to the upload directory
        var filePath = CARPETAPDF + "/" + "document" + ".pdf";
        const fileData = fs.readFileSync(filePath, 'utf8');
        await processFileData(fileData);

        // Determine the file type
        const fileExtension = uploadedFile.mimetype ?uploadedFile.mimetype : null;

        // Check if the file is already in PDF format
        if (fileExtension === 'application/pdf') {
            // Process the PDF directly
            await processPDF(filePath, res);
        } else {
            // Convert the file to PDF
            const convertedFilePath = await convertToPDF(filePath);

            // Process the converted PDF
            await processPDF(convertedFilePath, res);
        }
    } catch (error) {
         console.error('An error occurred while processing the file:', error);
         res.status(500).json({ error: 'Failed to process the file' });
    }
});

// Function to process the PDF and count word occurrences
async function processPDF(pdfFilePath, res) {
    try {
        // Parse the PDF content
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        const data = await PDFParser(pdfBuffer);
        const pdfText = data.text;

        // Define the words to search and their initial count
        const technologies = ['Node.js', 'React.js', 'Angular', 'Vue.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Sass', 'Bootstrap', 'jQuery', 'Python', 'Java', 'Ruby', 'Go', 'PHP', 'Swift', 'Kotlin', 'Rust', 'SQL', 'MongoDB', 'Firebase', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'Jenkins', 'CI/CD', 'REST API', 'GraphQL', 'OAuth', 'JSON', 'XML', 'Microservices', 'Artificial Intelligence', 'Machine Learning', 'Data Science', 'Big Data', 'Blockchain'];
        let wordCounts = {};

        // Count the occurrences of each search word
         technologies.forEach((word) => {
            const regex = new RegExp(word, 'gi');
            const count = (pdfText.match(regex) || []).length;
            wordCounts[word] = count;
        });

        // Return the word counts as the response
         wordCounts = Object.fromEntries(Object.entries(wordCounts).filter(([key, value]) => value !== 0));
         res.json({ wordCounts });
    } catch (error) {
          console.error('An error occurred while processing the PDF:', error);
          res.status(500).json({ error: 'Failed to process the PDF' });
    } finally {
        // Clean up - delete the uploaded file and PDF file if needed
    }
}

// Helper function to convert files to PDF using external converter
async function convertToPDF(filePath) {
  return new Promise((resolve, reject) => {
      const convertedFilePath = path.join('converted/', `nuevo_documento.pdf`);

      mammoth.extractRawText({ path: filePath })
      .then((result) => {
          console.log(result);
        })
      .catch((error) => {
          reject(error);
        });
    });

  }*/
//-----------------------
//-----------------------
//-----------------------



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


