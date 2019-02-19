const mongoose = require("mongoose");
//Connect to mongodb "protrack-app"
mongoose.connect('mongodb://localhost:27017/protrack-app', { useNewUrlParser: true });

window.onload=function() {
	
	function processForm(e) {
		if (e.preventDefault) e.preventDefault();
		
		/* do what you want with the form */
		
		// You must return false to prevent the default form behavior
		return false;
	}
	
	var form = document.getElementById('msForm');
	if (form.attachEvent) {
		form.attachEvent("submit", processForm);
	} else {
		form.addEventListener("submit", processForm);
	}
}

const handleFormSubmit = (event) => {98
	event.preventDefault();
	// TODO: Call our function to the form data.
	const data = {};
	const dataContainer = document.getElementsByClassName('results__display')[0];
	dataContainer.textContent = JSON.stringify(data, null, "  ");
 };
 
 
 const form = document.getElementsByClassName('contact-form')[0];
 form.addEventListener('submit', handerFormSubmit);