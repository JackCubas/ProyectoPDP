const URLSERVERpdfs = "http://localhost:3000/pdfs";

function checkUserHosting() {

    return fetch(URLSERVERpdfs)
        .then((response) => { 
            return response.json().then((data) => {
                return appendData(data);
            }).catch((err) => {
                console.log(err);
            }) 
        });

}

function appendData(data){
        var con=document.getElementById("main-container")
        for(let i=0;i<data.length;i++){
            console.log(data[i]);
            downloadModifiedPDF(data[i].pdfBase64)
        }
}

function downloadModifiedPDF(modifiedPDFBytes) {
    const blob = new Blob([modifiedPDFBytes], {
        type: "application/pdf",
    });
    const url = URL.createObjectURL(blob);

    // Create a link element to trigger the download.
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "modified_document.pdf"; // Specify the filename for the downloaded PDF.

    // Append the link to the body and click it to trigger the download.
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}



checkUserHosting();