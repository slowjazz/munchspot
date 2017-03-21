const express = require('express');
const app = express();
const request = require('request');
//const cors = require('cors');

//lol
const clientId = 'mJSModGrCxum1WkxHnIo7A';
const clientSecret = 'hLTYzcmpGjwn1VTiYkEwB2tyK8acPLxbBi8BaAQWnGJP2HlwgwROva6giSVMbhXt';

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

//Enable CORS
//app.use(cors());

// set the home page route
app.get('/', function(req, res) {
    // ejs render automatically looks in the views folder
    res.render('index');
});

//Access token POST request
app.post('/', (req, res) => {
    request.post({
            url: 'https://api.yelp.com/oauth2/token',
            form: { grant_type: 'client_credientials', client_id: clientId, client_secret: clientSecret }
        },
        function(err, httpResponse, body) {res.send(body)});
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

var sample = require('./sample.js');
