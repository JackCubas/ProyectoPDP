const URLSERVERDelete = "http://localhost:3000/delete-stamp";

async function sendData(){

    var userId = 2;

    const response = await fetch(URLSERVERDelete + '?userId=' + userId, {
        method: "DELETE"
    })

    window.location.href = "table.html";

}