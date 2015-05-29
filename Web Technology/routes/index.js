var express = require('express');
var router = express.Router();
var app = express();
var _ = require("underscore");

// create twit client
var twit = require("twit");
var client = new twit({
    consumer_key: '1Xm9ZQhZdkFOwKkwABjyFH9q3',
    consumer_secret: 'bZ0YdUgfWZIDvsCLRaRlpAWRu88saX2gWGLfCoSfVwPTUMyuHG',
    access_token: '3288379547-Em8DIkNc1mmoKQqoDUAs8mCxahQ6jMNduAxu5Go',
    access_token_secret: 'gHzlapAhUjuzCgpAaI8t5oQdzJTIwy7yjP9IowJClkgFB'
});
var db = require('../lib/db');

var users;
/* GET home page. */
router.get('/', function(req, res, next) {
    // array of tweet result
    var totalTweets = 10;
    var tweets = [];
    var twitQuery = req.query.query;
    var geoloc = req.query.geoloc;
    if (twitQuery == null) {
        res.render('index', {title: 'Search Twitter', "tweets": []});
    } else {
        var q = {};
        if (geoloc != null) {
            // process geolocation string
            geoloc = geoloc.replace(/\s+/g, "");
            geoloc = geoloc + ",1mi";
            q = {q: twitQuery, count: totalTweets, geocode: geoloc, include_entities: true};
        } else {
            q = {q: twitQuery, count: totalTweets, include_entities: true};
        }
        client.get("search/tweets", q, function (err, data) {
            users = [];
            var err_msg = null;
            if (err) {
                err_msg = err.message;
            } else {
                for (var i in data.statuses) {
                    var tweet = data.statuses[i];
                    var user = tweet.user;
                    users.push({
                        id_str: user.id_str,
                        name: user.name,
                        screen_name: user.screen_name,
                        location: user.location,
                        photo: user.profile_image_url,
                        text: user.description
                    });
                    // add each tweet to array
                    tweets.push(tweet);
                }
            }
            db.storeUsers(users);
            res.render('index', {title: 'Search Twitter', "tweets": tweets, err: err_msg});
        });
    }
});

module.exports = router;
