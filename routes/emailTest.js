const mailgun = require("mailgun-js");
require('dotenv').config();

const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: "mg.foldandpass.com"});

let testTitle = "The One that got Away";

const data = {
	from: `Fold and Pass noreply@foldandpass.com`,
	to: "johndurso@gmail.com",
	subject: "Hello",
	template: "notification",
	'h:X-Mailgun-Variables': `{"title": "${testTitle}", "linkOne": "https://foldandpass.com/story/5e7f9eb928e50b000467e107", "linkAll": "https://foldandpass.com/story/5e7f9eb928e50b000467e107", "message" : "testing testing"}`,
	//'h:X-Mailgun-Variables': `{"title": "${req.body.title}", "linkOne": "${req.body.urlOne}", "linkAll": "${req.body.urlAll}"}`
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});