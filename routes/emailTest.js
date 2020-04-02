const mailgun = require("mailgun-js");
const DOMAIN = "sandbox5b8a5a156f2e4160b69ffca0fad3dd67.mailgun.org";
const mg = mailgun({apiKey: "892aa861ce07edef62c1b8b7c0b0716c-b9c15f4c-1267a952", domain: DOMAIN});
const data = {
	from: "Mailgun Sandbox <postmaster@sandbox5b8a5a156f2e4160b69ffca0fad3dd67.mailgun.org>",
	to: "johndurso@gmail.com",
	subject: "Hello",
	template: "tester",
	'h:X-Mailgun-Variables': {"test": "testeroooni"}
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});