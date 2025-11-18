const URLSERVERretrieve = "http://localhost:3000/retrieve";

async function checkUserHosting() {

    //var datosURL = window.location.href.split('?');
    //var IdHTML = datosURL[1].replace("id=","");

    //const apiCall = await fetch(URLSERVERretrieve);

    const apiCall = await fetch(URLSERVERretrieve, {
        method: "GET",
        headers: {
            
            "Accept": "application/pdf"
        }
    })
    //const result = await apiCall.json();
    console.log(apiCall);
    //console.log(result);
    console.log("Analizando resultados");
    appendData(apiCall);

}

function appendData(data){
        var con=document.getElementById("main-container")
        var text = document.createTextNode("This just got added");
        con.appendChild(text);

        /*

        var blob = new Blob([req.response], { type: "application/octetstream" });
 
                //Check the Browser type and download the File.
                var isIE = false || !!document.documentMode;
                if (isIE) {
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    var url = window.URL || window.webkitURL;
                    link = url.createObjectURL(blob);
                    var a = document.createElement("a");
                    a.setAttribute("download", fileName);
                    a.setAttribute("href", link);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }

        */
        
}

checkUserHosting();