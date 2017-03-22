const express = require('express');
const app = express();
const request = require('request');
const yelp = require('yelp-fusion');

//Delete this later
const client_secret = require('./client_secret.js');

var access_token;

yelp.accessToken(client_secret.clientId, client_secret.clientSecret).then(response => {
    access_token = response.jsonBody.access_token;
    console.log(access_token);

    const client = yelp.client(access_token);

    apiCalls(client);
}).catch(e => {
    console.log(e);
});

function apiCalls(client) {
    app.get('/search', (req, res) => {
        client.search(req.query)
            .then(response => {
                console.log("response got GOT");
                res.send(response.jsonBody.businesses[0]);
            }).catch(e => {
                console.log(e);
            });
    });
}


// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {
    // ejs render automatically looks in the views folder
    res.render('index');
});



app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
