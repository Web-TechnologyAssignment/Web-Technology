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
  console.log("Caught query.");
  //res.send('respond with a resource');
});

module.exports = router;
