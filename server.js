// server.js
// where your node app starts

// init project
var bodyParser = require('body-parser');
var express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 8080;

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())

app.listen(port);




var fs = require('fs');
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



app.post('/upload',function(req,res){
  var toDownload = req.body.dataObject;
  fs.writeFile('tempDownload/DownloadedScene.txt', toDownload, function(err, data){
      if (err) console.log(err);
      console.log("Successfully Written to File.");
  });
  res.send("200");
/*  fs.readFile('tempDownload/temp.txt', function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such file");
            } else {
                //specify Content will be an attachment
                res.setHeader('Content-disposition', 'attachment; filename=dataObject');
                res.end(content);
            }
        });*/

});

app.get('/download',function(req,res){
var file = __dirname + '/tempDownload/DownloadedScene.txt';
  res.setHeader('Content-disposition', 'attachment; filename=DownloadedScene.txt');
  res.setHeader('Content-Type', 'text/txt');
  res.download(file);
});
