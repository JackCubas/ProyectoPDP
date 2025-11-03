function buildTable(json) {
  const table = document.getElementById("mytesttable").getElementsByTagName('tbody')[0];
  for (let i = 0; i < json.data.length; i++) {
    const newRow = table.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    cell1.textContent = json.data[i].emp_name;
    const button = document.createElement('button');
    button.id = "testbutton" + i;
    button.textContent = "Click Me";
    button.addEventListener('click', doSmth);
    cell2.appendChild(button);
  }
}

function doSmth(event) {
  alert(event.target.id);
}
// Example JSON data
const json = { data: [{ emp_name: "John Doe" }, { emp_name: "Jane Smith" }] };
buildTable(json);