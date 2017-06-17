var express = require('express');

var app = express();

app.set('view engine','pug');

app.get('/', function(req, res){
	res.render('index', {
		title: 'My App',
		name: 'Hamed Davandeh'
	});
});


app.listen(3000, function(){
	console.log('express is running on port 3000');
});