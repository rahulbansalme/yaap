var https = require('https');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.end('Youtube As Audio Player - Server');
})

app.get('/grab/:videoId', function (req, res) {
    // youtube2mp3api.com/@grab?vidID=kw4tT7SCmaY&format=mp3&streams=mp3&api=button
    var videoId = req.params.videoId;
    var options = {
        host: 'youtube2mp3api.com',
        port: 443,
        path: '/@grab?vidID=' + videoId + '&format=mp3&streams=mp3&api=button',
        headers: {
            referer: 'https://youtube2mp3api.com/@api/button/mp3/' + videoId,
        }
    };
    https.get(options, (_res) => {
        _res.on('data', function (chunk) {
            res.write(chunk)
        });
    }).on('error', (e) => {
        console.error(e);
    });
})

var port = process.env.PORT || 9000;

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
  