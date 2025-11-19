const URLSERVERretrieve = "http://localhost:3000/retrieveAxios";

async function checkUserHosting() {

    let header = {
        "Content-Type": "application/json",
    };

    const response = await axios(
           URLSERVERretrieve,
            {
            method: "GET",
            responseType: "blob", //Force to receive data in a Blob Format
            },
            { headers: header }
    );

    //return response.data;

    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL); 
    
    appendData(file);

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