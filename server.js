// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/examples', function(request, response) {
  response.sendFile(__dirname + '/views/examples.html');
});

app.get('/documentation', function(request, response) {
  response.sendFile(__dirname + '/views/documentation.html');
});

app.get('/circularMotion', function(request, response) {
  response.sendFile(__dirname + '/views/circularMotion.html');
});

app.get('/SHM', function(request, response) {
  response.sendFile(__dirname + '/views/SHM.html');
});

app.get('/SHMPendulum', function(request, response) {
  response.sendFile(__dirname + '/views/SHMPendulum.html');
});

app.get('/SHMMultiplePendulums', function(request, response) {
  response.sendFile(__dirname + '/views/SHMMultiplePendulums.html');
});

app.get('/DoublePendulum', function(request, response) {
  response.sendFile(__dirname + '/views/DoublePendulum.html');
});

app.get('/dampedOscillations', function(request, response) {
  response.sendFile(__dirname + '/views/dampedOscillations.html');
});

app.get('/forcedOscillations', function(request, response) {
  response.sendFile(__dirname + '/views/forcedOscillations.html');
});

app.get('/TransverseWave', function(request, response) {
  response.sendFile(__dirname + '/views/TransverseWave.html');
});

app.get('/wavesPlayground_2', function(request, response) {
  response.sendFile(__dirname + '/views/wavesPlayground_2.html');
});

app.get('/2dWaves', function(request, response) {
  response.sendFile(__dirname + '/views/2dWaves.html');
});

app.get('/SHMVideoProof', function(request, response) {
  response.sendFile(__dirname + '/views/SHMVideoProof.html');
});

app.get('/SHMDampedVideoProof', function(request, response) {
  response.sendFile(__dirname + '/views/SHMDampedVideoProof.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
