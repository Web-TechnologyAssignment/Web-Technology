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
        if (geoloc != null) {
            // process geolocation string
            console.log("With location");
            geoloc = geoloc.replace(/\s+/g, "");
            geoloc = geoloc + ",1mi";
            client.get("search/tweets", {q: twitQuery, count: totalTweets, geocode: geoloc, include_entities: true},
                function (err, data) {
                    users = [];
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
                    db.storeUsers(users);
                    res.render('index', _.extend({ title: 'Search Twitter'},{"tweets": tweets}));
                });
        } else {
            client.get("search/tweets", {q: twitQuery, count: totalTweets, include_entities: true},
                function (err, data) {
                    users = [];
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
                    db.storeUsers(users);
                    res.render('index', _.extend({ title: 'Search Twitter'},{"tweets": tweets}));
                });
        }

    }
});

// get retweet information
function getRetweets(err, data, response) {
    console.log("Error : ")
    console.log(err);
    console.log("Data : ");
    console.log(data);
}

module.exports = router;
