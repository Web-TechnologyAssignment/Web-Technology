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


/* GET home page. */
router.get('/', function(req, res, next) {
    // array of tweet result
    var tweets = [];
    var twitQuery = req.query.query;
    if (twitQuery == null) {
        res.render('index', {title: 'Search Twitter', "tweets": []});
    } else {
        client.get("search/tweets", {q: twitQuery, count: 0},
            function (err, data) {
                for (var count in data.statuses) {
                    var tweet = data.statuses[count];
                    // add each tweet to array
                    tweets.push(tweet.text);
                    console.log(count + ": " + tweets[count]);
                    //console.log('on: ' + tweet.created_at + ' : @'
                    //    + tweet.user.screen_name + ' : '
                    //    + tweet.text+'\n\n');
                }
                res.render('index', _.extend({ title: 'Search Twitter'},{"tweets": tweets}));
            });
    }
});

/* GET hello world page. */
router.get('/helloworld', function(req, res, next) {
  res.render('helloworld', { title: 'Hello, World!' });
});

app.get("/", function(req, res) {
  console.log("Have a request");
});
module.exports = router;
