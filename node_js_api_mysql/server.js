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
const PDFParser = require('pdf-parse');
const fs = require('fs');
const uploadDirectory = CARPETAPDF;
//const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');

var multer = require('multer');
//var upload = multer({dest: uploadDirectory});

const fileUpload = require('express-fileupload');
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
          connection.query("SELECT id, userId, name, urlCarpeta FROM pdfs", function (err, result, fields) {
              if (err) throw err;
              
              console.log(result);

              //result.docBlob = new Blob([result.docBlob], {
              //    type: "application/pdf",
              //});

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));

              var carpetUrl = resultRows[0].urlCarpeta;

              console.log(resultRows);
              res.json(resultRows);
          });
      });

  } catch (error) {
      console.log("Error al conectar con la base de datos");
  }

});

app.get("/pdfs/:userId", cors(), (req, res) => {

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

          var sql = "SELECT id, userId, name, urlCarpeta FROM pdfs WHERE userId = ?";

          let values = [
            [userId]
          ]

          connection.query(sql,[values], function (err, result, fields) {
              if (err) throw err;
              
              console.log(result);

              //result.docBlob = new Blob([result.docBlob], {
              //    type: "application/pdf",
              //});

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));

              var carpetUrl = resultRows[0].urlCarpeta;

              console.log(resultRows);
              res.json(resultRows);
          });
      });

  } catch (error) {
      console.log("Error al conectar con la base de datos");
  }

});

app.get("/pdfs/:id", cors(), (req, res) => {

   console.log("get pdf by id!");

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
          
        //SELECT id, name, CONCAT('data:image/jpeg;base64,', CAST(blob_data AS CHAR CHARSET utf8mb4)) AS base64_data FROM blob_table;
        //SELECT id, name, TO_BASE64(blob_data) AS base64_data FROM pdfs

          var sql = "SELECT id, userId, name, urlCarpeta FROM pdfs WHERE id = ?";

          let values = [
            [id]
          ]

          connection.query(sql,[values], function (err, result, fields) {
              if (err) throw err;
              
              console.log(result);

              //result.docBlob = new Blob([result.docBlob], {
              //    type: "application/pdf",
              //});

              resultRows = Object.values(JSON.parse(JSON.stringify(result)));

              var carpetUrl = resultRows[0].urlCarpeta;

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
    console.log(req.body);

    let sql = "INSERT INTO pdfs (userId, name, urlCarpeta) VALUES ?";

    var urlCarpeta = CARPETAPDF + "/" + req.body.name + ".pdf";
    var datosPDF = req.body.docDatos;

    console.log(urlCarpeta);
    //console.log(datosPDF);

    if(datosPDF){
      console.log(datosPDF);
      console.log("procesando");
      var base64Data = datosPDF.replace("data:application/pdf;base64,", "");
      //require("fs").writeFile(urlCarpeta, base64Data, 'base64',
      require("fs").writeFileSync(urlCarpeta, base64Data, 'base64', function(err) {
        console.log("error");
        console.log(err);
      });
    }

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
});

//-------------------
//-------------------

app.post('/uploadPuro', fileUpload(), function(req, res) { 
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
})

app.post('/upload', fileUpload(), function(req, res) { 
  console.log("llegado al upload"); 
  const sampleFile = req.files.uploadedFile;
  const nombreFile = req.body.filename;
  const archivoNombrePrueba = CARPETAPDF + "/" + 'output.pdf';

  //console.log(req);
  //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXx");
  //console.log(req.files);
  //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXx");
  //console.log(sampleFile);
  //console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXx");
  //console.log(sampleFile.data);
  console.log("yyyyyyyyyyyyyyyyyyy");
  console.log(nombreFile);

  fs.writeFileSync(archivoNombrePrueba, sampleFile.data, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
  });

  res.send('File uploaded');
})

app.get('/retrieve', function(req, res) { 
  console.log("llegado al retrieve");
  
  const archivoNombrePruebaRetrieve = CARPETAPDF + "/" + 'output.pdf'; 
  var formData  = new FormData();

  if (fs.existsSync(archivoNombrePruebaRetrieve)) {

    //'ascii', 'base64', 'binary', 'utf8'
    //const fileData = fs.readFileSync(filePath);
    //const buffer = Buffer.from(fileData, "binary");
    /*fs.readFileSync(archivoNombrePruebaRetrieve, (err, data) => {
      console.log("leyendo archivo");

      if (err) {
        console.error('Error reading file:', err);
        return;
      }

      console.log('File contents:', data.toString());

    });*/

    const fileData = fs.readFileSync(archivoNombrePruebaRetrieve);
    console.log(fileData);
    const buffer = Buffer.from(fileData, "binary");
    //console.log(buffer);

    formData.append("filename", 'output.pdf');
    formData.append("uploadedFile", buffer);

  }

  console.log("finalizado retrieve");
  //console.log(formData);
  res.json({formData});

  //request.end();
})


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
