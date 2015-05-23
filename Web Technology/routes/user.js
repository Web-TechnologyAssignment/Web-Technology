var express = require('express');
var router = express.Router();

// create twit client
var twit = require("twit");
var client = new twit({
  consumer_key: '1Xm9ZQhZdkFOwKkwABjyFH9q3',
  consumer_secret: 'bZ0YdUgfWZIDvsCLRaRlpAWRu88saX2gWGLfCoSfVwPTUMyuHG',
  access_token: '3288379547-Em8DIkNc1mmoKQqoDUAs8mCxahQ6jMNduAxu5Go',
  access_token_secret: 'gHzlapAhUjuzCgpAaI8t5oQdzJTIwy7yjP9IowJClkgFB'
});

/* GET users listing. */
router.get('/user', function(req, res, next) {
  var num_of_days = req.query.num_of_days;
  var num_of_keywords = req.query.num_of_keywords;
  var screen_names = req.query.screen_names;
  screen_names = screen_names.split(",");
  console.log(screen_names);

  var day = new Date();
  console.log(day);
  day.setDate(day.getDate() - num_of_days);
  console.log(day);
  client.get("search/tweets",{q: "from:" + screen_names[0] + " since:" + day.getFullYear() + "-0"
  + (day.getMonth() + 1) + "-" + day.getDate()}, statTweets);

  console.log("search/tweets",{q: "from:" + screen_names[0] + " since:" + day.getFullYear() + "-"
  + (day.getMonth() + 1) + "-" + day.getDate(), result_type: "recent"});
  console.log(day);
  res.render('user', { title: 'Search Twitter User'});
});

function statTweets(err, data, response) {
  console.log(data);
}











module.exports = router;
