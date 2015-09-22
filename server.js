var express 		= require('express'),
    app     		= express();

var port    = 8000;
var request = require('request');

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

var FBClientId = '1690654501163960';

var FBClientSecret = 'f4d4028794a5adad38b8695612e4bc29';

app.use('/bower', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/client'));

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
        'User-agent': 'Tinder/4.6.0 (iPhone; iOS 8.1; Scale/2.00)',
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

app.get('/auth/:id/:auth', function(req, res) {
	var obj = {"facebook_token": req.params.auth.toString(), "facebook_id": req.params.id.toString()};
    request({
    url: 'https://api.gotinder.com/auth',
    method: 'POST', 
    json: true,
    body: obj,
    headers: { 
        'Content-Type': 'application/json',
        'User-agent': 'Tinder/4.6.0 (iPhone; iOS 8.1; Scale/2.00)'
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
        'User-agent': 'Tinder/4.6.0 (iPhone; iOS 8.1; Scale/2.00)',
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
        'User-agent': 'Tinder/4.6.0 (iPhone; iOS 8.1; Scale/2.00)',
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
        'User-agent': 'Tinder/4.6.0 (iPhone; iOS 8.1; Scale/2.00)',
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
        'User-agent': 'Tinder/4.6.0 (iPhone; iOS 8.1; Scale/2.00)',
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
