var express = require('express');
var router = express.Router();
var foursquare = require('../lib/foursquare');
var count = require("../lib/count");
var _ = require("underscore");




router.get('/foursquare', function(req, res, next) {
    if (req.query.name == null) {
        console.log("Four square");
        res.render('foursquare', {title: 'Search Four Square!'});
    } else {
        console.log("Search by : " + req.query.search);
        console.log("Looking for " + req.query.name);
        console.log("In " + req.query.day + " days");
        foursquare.get('112', '11', function() {
            console.log('this is callback');
        });
        res.render('foursquare', {title: 'Search Four Square!'});
    }

});

module.exports = router;
