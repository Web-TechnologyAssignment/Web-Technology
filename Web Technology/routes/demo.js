var express = require('express');
var router = express.Router();
var count = require("../lib/count");
var _ = require("underscore");

var jsonVariable = {};
var keywords = [ { key: 'the', total: 3 },
    { key: 'is', total: 1 },
    { key: 'now', total: 1 },
    { key: 'to', total: 2 },
    { key: 'of', total: 4 },
    { key: 'on', total: 1 },
    { key: 'for', total: 1 },
    { key: 'here', total: 1 } ];


router.get('/demo', function(req, res, next) {
    keywords.sort(function (a, b) {
        return b.total - a.total;
    });
    console.log(keywords);
    res.render('demo', {title: 'Test node js functions'});
});

module.exports = router;
