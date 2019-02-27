const mongoose = require("mongoose");
//Connect to mongodb "protrack-app"
mongoose.connect('mongodb://localhost:27017/protrack-app', { useNewUrlParser: true });

const formToJSON = elements => [].reduce.call(elements, (data, element) => {
	data[element.name] = element.value;
	return data;
 }, {});
 
 const handleFormSubmit = (event) => {
	event.preventDefault();
	// TODO: Call our function to the form data.
	const data = formToJSON(form.elements);
	const dataContainer = document.getElementsByClassName('results__display')[0];
	dataContainer.textContent = JSON.stringify(data, null, "  ");
 };
 
 
 const form = document.getElementsByClassName('contact-form')[0];
 form.addEventListener('submit', handleFormSubmit);
 
 
 //For output
 function myFunction() {
	var x = document.getElementById("myOutput").name;
	document.getElementById("demo").innerHTML = x;
 }