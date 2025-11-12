var datosPDF;

document.getElementById('filetoRead').addEventListener(
  'change',
  function () {
    var file = this.files[0];
    
    if (file) {
      var reader = new FileReader();
      
      // data:application/pdf;base64,btoa(unescape(encodeURIComponent(evt.target.result)))
      reader.onload = function (evt) {
        // console.log(evt.target.result);
        datosPDF = 'data:application/pdf;base64,'+btoa(unescape(encodeURIComponent(evt.target.result)));
        console.log('pdf base64', datosPDF)
        // console.log('file-content', btoa(unescape(encodeURIComponent(evt.target.result))))
        method1Workind(evt);
        // method2(evt);
      };

      reader.onerror = function (evt) {
        console.error('An error ocurred reading the file', evt);
      };
      //method1Workind(evt);
      // reader.readAsArrayBuffer(file, 'UTF-8');
      // reader.readAsText(file, 'UTF-8');
      reader.readAsDataURL(file, 'UTF-8');
      // reader.readAsArrayBuffer(file, 'UTF-8');
    }
  },
  false
);
function method2(evt) {
  const blob = new Blob([new Uint8Array(evt.target.result)], {
    type: 'application/pdf',
  });

  const pdfUrl = window.URL.createObjectURL(blob);
  console.log(pdfUrl);
}

function method1Workind(evt) {
  const blob = new Blob([toUint8Array(evt.target.result)], {
    type: 'application/pdf',
  });

  const pdfUrl = window.URL.createObjectURL(blob);
  console.log(pdfUrl);
}

function downloadPdfFromBase64(base64String, fileName) {
  const binaryString = atob(base64String);
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([uint8Array], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  console.log('url', url);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = fileName;
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);
  // URL.revokeObjectURL(url);
}

function str2ab(str) {
  var array = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
}
// function stringToArrayBuffer( string, encoding, callback ) {
//   var blob = new Blob([string]);
//   var reader = new FileReader();
//   reader.onload = function(evt){callback(evt.target.result);};
//   reader.readAsArrayBuffer(blob);
// }
const DATA_URI_PREFIX_REGEX =
  /^(data)?:?([\w\/\+]+)?;?(charset=[\w-]+|base64)?.*,/i;
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


async function sendData(){
    const URLSERVERCreate = "http://localhost:3000/create-pdf";

    var projectName = document.getElementById("project_name").value;

    var pdfBlob = new Blob([datosPDF], {
        type: "application/pdf"})

    //pdfBlob = document.getElementById("filetoRead").files[0];

    const nuevoPDF = {
        userId: 2,
        name: projectName,
        docBlob: pdfBlob
        
    }

    /*const nuevoPDF = {
        name: projectName,
        docBlob: datosPDF
    }*/        

    await fetch(URLSERVERCreate, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nuevoPDF)
    })

}