var express = require('express');
var router = express.Router();
var twit = require("twit");
var client = new twit({
    consumer_key: '1Xm9ZQhZdkFOwKkwABjyFH9q3',
    consumer_secret: 'bZ0YdUgfWZIDvsCLRaRlpAWRu88saX2gWGLfCoSfVwPTUMyuHG',
    access_token: '3288379547-Em8DIkNc1mmoKQqoDUAs8mCxahQ6jMNduAxu5Go',
    access_token_secret: 'gHzlapAhUjuzCgpAaI8t5oQdzJTIwy7yjP9IowJClkgFB'
});
var util = require("../lib/util");



router.get('/foursquare', function(req, res, next) {
    var query = req.query;
    if (query.name == null || query.name.length == 0) {
        console.log(query.name);
        res.render('foursquare', {title: 'Search Four Square!'});
    } else {
        client.get("search/tweets", { q: "from:zumrantk swarmapp", count: 1}, function(err, data) {
        console.log(data.statuses);
        });
        res.render('foursquare', {title: 'Search Four Square!'});

    }

});

module.exports = router;
