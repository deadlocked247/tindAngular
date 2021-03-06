
var express 		= require('express'),
    app     		= express();
var bodyParser = require('body-parser');
var port    = 8000;
var request = require('request');


app.use(bodyParser());

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/bower', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/client'));

app.post('/updates/:token', function(req, res) {
	request({
    url: 'https://api.gotinder.com/updates',
    method: 'POST',
    form:JSON.stringify(req.body),
    headers: { 
        'Content-Type': 'application/json',
        'User-agent': 'Tinder/4.6.1 (iPhone; iOS 9.1; Scale/2.00)',
        'X-Auth-Token': req.params.token.toString()
    }
	}, function(error, response, body){

	    if(error) {
	        console.log(error);
	    } else {
	        res.send(body);
	    }
	});
});


app.get('/messages/:token', function(req, res) {
	
	request({
    url: 'https://api.gotinder.com/updates',
    method: 'POST',
    form: 
    {
    	'last_activity_date': ""
    },
    headers: { 
        'Content-Type': 'application/json',
        'User-agent': 'Tinder/4.6.1 (iPhone; iOS 9.1; Scale/2.00)',
        'X-Auth-Token': req.params.token.toString()
    }
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {
	        res.send(body);
	    }
	});
});

app.use(bodyParser());


app.post('/sendMessage/:id', function(req, res) {
	console.log(req.cookies);
	request({
    url: 'https://api.gotinder.com/user/matches/' + req.params.id,
    method: 'POST',
    form: req.body.data,
    headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Tinder/4.6.1 (iPhone; iOS 9.0.1; Scale/2.00)',
        'X-Auth-Token': req.body.auth.toString()
    }
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {
	    	console.log(body);
	        res.send(body);
	    }
	});
});

app.get('/auth/:id/:auth', function(req, res) {
	var obj = {"facebook_token": req.params.auth.toString(), "facebook_id": req.params.id.toString()};
    request({
    url: 'https://api.gotinder.com/auth',
    method: 'POST', 
    json: true,
    body: obj,
    headers: { 
        'Content-Type': 'application/json',
        'User-agent': 'Tinder/4.6.1 (iPhone; iOS 9.1; Scale/2.00)'
    }
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {
	        res.send(body);
	    }
	});
});

app.get('/nearby/:token', function(req, res) {
    request({
    url: 'https://api.gotinder.com/user/recs',
    method: 'GET', 
    headers: { 
        'Content-Type': 'application/json',
        'User-agent': 'Tinder/4.6.1 (iPhone; iOS 9.1; Scale/2.00)',
        'X-Auth-Token': req.params.token.toString()
    }
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {

	        res.send(body);
	    }
	});
});

app.get('/profile/:token', function(req, res) {
	request({
    url: 'https://api.gotinder.com/profile',
    method: 'GET', 
    headers: { 
        'Content-Type': 'application/json',
        'User-agent': 'Tinder/4.6.1 (iPhone; iOS 9.1; Scale/2.00)',
        'X-Auth-Token': req.params.token.toString()
    }
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {

	        res.send(body);
	    }
	});
})

app.get('/swipeRight/:token/:id', function(req, res) {
	request({
		url:'https://api.gotinder.com/like/' + req.params.id,
		method:'GET',
		headers: { 
        'Content-Type': 'application/json',
        'User-agent': 'Tinder/4.6.1 (iPhone; iOS 9.1; Scale/2.00)',
        'X-Auth-Token': req.params.token.toString()
    }
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {

	        res.send(body);
	    }
	});
})

app.get('/swipeLeft/:token/:id', function(req, res) {
	request({
		url:'https://api.gotinder.com/pass/' + req.params.id,
		method:'GET',
		headers: { 
        'Content-Type': 'application/json',
        'User-agent': 'Tinder/4.6.1 (iPhone; iOS 9.1; Scale/2.00)',
        'X-Auth-Token': req.params.token.toString()
    }
	}, function(error, response, body){
	    if(error) {
	        console.log(error);
	    } else {

	        res.send(body);
	    }
	});
})




app.use('/swipe', express.static(__dirname + '/client/swipe.html'));

app.listen((process.env.PORT || port), function() {
	console.log("tindAngular listening on " + port);
});
