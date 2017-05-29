'use strict';

let log = console.log;

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const nunjucks = require('nunjucks');
const parseurl = require('parseurl');


const { db, } = require('./pgp');

app.use(bodyParser.urlencoded({
    extended: true
}));

nunjucks.configure('views', {
    autoescape: false,
    express   : app,
    cache : false
});


app.engine('html', nunjucks.render);

app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

require('./routes/routes')(app, express);

const port = 3000;
app.listen(port, () => {
    console.log('Ready for GET requests on http://localhost:' + port);
});
