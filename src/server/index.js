var request = require('request');
var express = require('express');
var cors = require('cors');
var app = express();

app.use(cors())

app.get('/', function (req, res) {
    res.end('Youtube As Audio Player - Server');
})

app.get('/grab/:videoId', function (req, res) {
    // youtube2mp3api.com/@grab?vidID=kw4tT7SCmaY&format=mp3&streams=mp3&api=button
    var videoId = req.params.videoId;
    var options = {
        method: 'GET',
        url: 'https://youtube2mp3api.com/@grab?vidID=' + videoId + '&format=mp3&streams=mp3&api=button',
        headers: {
            referer: 'https://youtube2mp3api.com/@api/button/mp3/' + videoId,
        }
    };
    request(options, function (error, response, body) {
        res.send(body)
    });
})

var port = process.env.PORT || 9000;

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("listening at http://%s:%s", host, port)
})
  