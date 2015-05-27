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

var day;
router.get('/visitor', function(req, res, next) {
    var query = req.query;

    if (query != null && query.select) {
        var select = query.select;
        var loc = query.loc;
        day = new Date();
        day.setDate(day.getDate() - query.day);

        var q = {count: 5, q: "since:" + day.getFullYear() + "-0" + (day.getMonth() + 1) + "-" +
        day.getDate() + " swarmapp " + loc};
        console.log(q);
        var users = [];
        client.get("search/tweets",q , function(err, data) {
            for (var index in data.statuses) {
                var user = data.statuses[index].user;
                users.push({
                    id_str: user.id_str,
                    name: user.name,
                    screen_name: user.screen_name,
                    location: user.location,
                    photo: user.profile_image_url
                });
            }
            console.log(users);
            res.render('visitor', {title: 'Search Venue Visitor', users: users});
        });
    } else {
        res.render('visitor', {title: 'Search Venue Visitor'});
    }

});

module.exports = router;
