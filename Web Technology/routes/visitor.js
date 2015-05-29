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
var util = require('../lib/util');
var foursquare = require("../lib/foursquare");
var db = require("../lib/db");
var day;
router.get('/visitor', function(req, res, next) {
    var query = req.query;

    if (query != null && query.select) {
        var select = query.select;
        var loc = query.loc;
        day = new Date();
        day.setDate(day.getDate() - query.day);

        var q = {count: 100, q: "since:" + day.getFullYear() + "-0" + (day.getMonth() + 1) + "-" +
        day.getDate() + " swarmapp " + loc};
        var users = [];
        var venues = {};
        venues['users'] = {};
        venues['checkin'] = {};
        venues['venues'] = {};
        var counter = 0;
        var max_length = 0;
        client.get("search/tweets",q , function(err, data) {
            max_length = data.statuses.length;
            for (var index in data.statuses) {
                var url = util.getURL(data.statuses[index].text);
                var user = data.statuses[index].user;
                users.push({
                    id_str: user.id_str,
                    name: user.name,
                    screen_name: user.screen_name,
                    location: user.location,
                    photo: user.profile_image_url,
                    text: user.description
                });
                venues['users'][url] = {user: users[index]};
                util.expandURL(url, function (checkin, shortUrl) {
                    venues['checkin'][checkin] = {shortUrl :shortUrl};
                    foursquare.get("checkins/resolve", {shortId: checkin}, function (error, response, body, params) {
                        if (!error && response.statusCode == 200) {
                            var data = JSON.parse(body);
                            var venue_info = data.response.checkin.venue;
                            venues['venues'][params.shortId] = venue_info;
                        }
                        counter++;
                        if (counter == max_length) {
                            console.log("did");
                            db.storeVenuesWithUser(venues);
                        }
                    });
                });
            }
            res.render('visitor', {title: 'Search Venue Visitor', users: users});
        });
    } else {
        res.render('visitor', {title: 'Search Venue Visitor'});
    }

});

module.exports = router;
