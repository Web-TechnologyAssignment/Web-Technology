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
var tweets = {
  "tweets" : ["tweet A", "tweet B", "Tweet C"]
}


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log( tweets);
  var twitQuery = req.query.query;;
  if (twitQuery == null) {
    res.render('index', { title: 'Express',tweets: [] });
  } else {
    console.log("twit query : " + twitQuery);
    res.render('index', _.extend({ title: 'Express'},tweets));
    client.get("search/tweets", { q: twitQuery, count: 1},
    function(err, data, res) {
      for (var count in data.statuses) {
        var tweet= data.statuses[count];
        console.log('on: ' + tweet.created_at + ' : @'
            + tweet.user.screen_name + ' : '
            + tweet.text+'\n\n');
      }
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
