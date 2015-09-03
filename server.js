var express 		= require('express'),
    app     		= express();

var port    = 8000;

var TinderPro = require('tinder_pro');
var tinder = new TinderPro();

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/bower', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/client'));

app.get('/auth/:id/:auth', function(req, res) {
	tinder.sign_in(req.params.id, req.params.auth, function(err, res, body){
		var returnObj = {};
		tinder.get_nearby_users(function(err, res, body) {
			returnObj.nearby = body;
			console.log(body);
			tinder.fetch_updates(function(err, res, body) {
				returnObj.updates = body;
				console.log(returnObj);
			});
		});
		
		
	});
})

app.get('/nearby', function(req, res) {
	
})

app.use('/swipe', express.static(__dirname + '/client/swipe.html'));

app.listen(port, function() {
	console.log("tindAngular listening on "+port);
});
