var express = require('express');
var router = express.Router();
var count = require("../lib/count");
var db = require("../lib/db");
// create twit client
var twit = require("twit");
var client = new twit({
    consumer_key: '1Xm9ZQhZdkFOwKkwABjyFH9q3',
    consumer_secret: 'bZ0YdUgfWZIDvsCLRaRlpAWRu88saX2gWGLfCoSfVwPTUMyuHG',
    access_token: '3288379547-Em8DIkNc1mmoKQqoDUAs8mCxahQ6jMNduAxu5Go',
    access_token_secret: 'gHzlapAhUjuzCgpAaI8t5oQdzJTIwy7yjP9IowJClkgFB'
});
var map = [];
var users;
var counter = 0;
var max_length = 0;
/* GET users listing. */
router.get('/user', function(req, res, next) {
    var query = req.query;
    if (query.screen_names == null || query.screen_name == "") {
        console.log("empty");
        res.render('user', {title: 'Search Twitter User'});
    } else {
        var num_of_keywords = query.num_of_keywords;
        var screen_names = query.screen_names;
        var day = new Date();
        screen_names = screen_names.split(",");
        day.setDate(day.getDate() - query.num_of_days);

        map = [];
        counter = 0;
        max_length = screen_names.length;
        for (var name_index in screen_names) {
            var q = {q: "from:" + screen_names[name_index] + " since:" + day.getFullYear() + "-0"
            + (day.getMonth() + 1) + "-" + day.getDate(), count: 100};
            client.get("search/tweets", q, function (err, data) {
                console.log("start: " + counter);
                if (data.statuses.length != 0) {
                    users = [];
                    var username = data.statuses[0].user.name;
                    var word_map = {};
                    for (var index in data.statuses) {
                        var user = data.statuses[index].user;
                        var text = data.statuses[index].text;
                        word_map = count.countKeywords(text, word_map);
                        users.push({
                            id_str: user.id_str,
                            name: user.name,
                            screen_name: user.screen_name,
                            location: user.location,
                            photo: user.profile_image_url,
                            text: user.description
                        });
                    }
                    db.storeUsers(users);
                    map.push({ username: username,words: word_map});
                }
                counter++;
                if (counter == max_length) {
                    var temp = {title: 'Search Twitter User with new data',stats: count.commonKeywords(map, num_of_keywords)};
                    console.log(temp.stats[temp.stats.length - 1]);
                    res.render('user', temp);
                }
            });
            console.log(q);
        }
    }
});




module.exports = router;
