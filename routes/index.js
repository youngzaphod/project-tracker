const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();


app.use('/api', router);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use((req,res,next) => {
	console.log('we use the router, and next moves to the next requests');
	next();
});


router.get('/', (req, res) => {
	res.json({ message: 'You did it! Great job!'});
});


module.exports = router;
				
				
				
				