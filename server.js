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


var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://Kareem:Koko123@ds151012.mlab.com:51012/physics_simulation"

var fs = require('fs');
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"index"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/examples', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"examples"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/examples.html');
});

app.get('/documentation', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"documentation"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/documentation.html');
});

app.get('/circularMotion', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"circularMotion"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/circularMotion.html');
});

app.get('/SHM', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"SHM"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/SHM.html');
});

app.get('/SHMPendulum', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"SHMPendulum"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/SHMPendulum.html');
});

app.get('/SHMMultiplePendulums', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"SHMMultiplePendulums"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/SHMMultiplePendulums.html');
});

app.get('/DoublePendulum', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"DoublePendulum"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/DoublePendulum.html');
});

app.get('/dampedOscillations', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"dampedOscillations"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/dampedOscillations.html');
});

app.get('/forcedOscillations', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"forcedOscillations"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/forcedOscillations.html');
});

app.get('/TransverseWave', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"TransverseWave"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/TransverseWave.html');
});

app.get('/wavesPlayground_2', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"wavesPlayground_2"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/wavesPlayground_2.html');
});

app.get('/2dWaves', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"2dWaves"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/2dWaves.html');
});

app.get('/SHMVideoProof', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"SHMVideoProof"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/SHMVideoProof.html');
});

app.get('/SHMDampedVideoProof', function(req, response) {
  var ip = req.headers['x-forwarded-for'] ||
   req.connection.remoteAddress ||
   req.socket.remoteAddress ||
   (req.connection.socket ? req.connection.socket.remoteAddress : null);
var toSave = {
  "ipAddress":ip,
  "time":getDateTime(),
  "link":"SHMDampedVideoProof"
}
MongoClient.connect(url,function(err,db){
  if(err) throw err;
  db.collection("userData").insertOne(toSave,function(err,res){
    if(err) throw err;
    db.close();
  });
});
  response.sendFile(__dirname + '/views/SHMDampedVideoProof.html');
});



app.post('/upload',function(req,res){
  var toDownload = req.body.dataObject;
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
  var toSave = {
    "ipAddress":ip,
    "scene":toDownload,
    "time":getDateTime()
  }
  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    db.collection("createScenes").insertOne(toSave,function(err,res){
      if(err) throw err;
      db.close();
    });
  });
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


function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}
