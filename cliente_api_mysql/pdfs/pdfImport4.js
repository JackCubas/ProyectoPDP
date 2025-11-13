var datosPDF;
const URLSERVERCreate = "http://localhost:3000/create-pdf";

function method1Workind(evt) {
    const blob = new Blob([toUint8Array(evt.target.result)], {
        type: 'application/pdf',
    });

    const pdfUrl = window.URL.createObjectURL(blob);

    console.log("prueba2")
    console.log(blob);
    alert("prueba2");

    console.log(pdfUrl);
}

const toUint8Array = (input) => {
  // debugger;
  console.log(typeof input);
  if (typeof input === 'string') {
    return decodeFromBase64DataUri(input);
  } else if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  } else if (input instanceof Uint8Array) {
    return input;
  } else {
    throw new TypeError(
      '`input` must be one of `string | ArrayBuffer | Uint8Array`'
    );
  }
};

const decodeFromBase64DataUri = (dataUri) => {
  const trimmedUri = dataUri.trim();

  const prefix = trimmedUri.substring(0, 100);
  const res = prefix.match(DATA_URI_PREFIX_REGEX);

  // Assume it's not a data URI - just a plain base64 string
  if (!res) return decodeFromBase64(trimmedUri);

  // Remove the data URI prefix and parse the remainder as a base64 string
  const [fullMatch] = res;
  const data = trimmedUri.substring(fullMatch.length);

  return decodeFromBase64(data);
};

const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Use a lookup table to find the index.
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

const decodeFromBase64 = (base64) => {
  let bufferLength = base64.length * 0.75;
  const len = base64.length;
  let i;
  let p = 0;
  let encoded1;
  let encoded2;
  let encoded3;
  let encoded4;

  if (base64[base64.length - 1] === '=') {
    bufferLength--;
    if (base64[base64.length - 2] === '=') {
      bufferLength--;
    }
  }

  const bytes = new Uint8Array(bufferLength);

  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return bytes;
};

const DATA_URI_PREFIX_REGEX =
  /^(data)?:?([\w\/\+]+)?;?(charset=[\w-]+|base64)?.*,/i;

async function sendData(){

    var projectName = document.getElementById("project_name").value;
    /*datosPDF = document.getElementById("filetoRead").files[0];

    var pdfBlob = new Blob([datosPDF], {
        type: "application/pdf"})*/

    var pdfDatosBrutos = document.getElementById("filetoRead").files[0];

    console.log("prueba")
    console.log(pdfDatosBrutos);
    alert("prueba");

    if (pdfDatosBrutos) {
      var reader = new FileReader();
      reader.onload = function (evt) {
        datosPDF = 'data:application/pdf;base64,'+btoa(unescape(encodeURIComponent(evt.target.result)));
        console.log('pdf base64', datosPDF)
        method1Workind(evt);
      };

      reader.onerror = function (evt) {
        console.error('An error ocurred reading the file', evt);
      };
      
      reader.readAsDataURL(pdfDatosBrutos, 'UTF-8');
    } 
    
    console.log("prueba3")
    console.log(datosPDF);
    alert("prueba3");

    const nuevoPDF = {
        userId: 2,
        name: projectName,
        docDatos: datosPDF
        
    }     

    await fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoPDF)
    })

}