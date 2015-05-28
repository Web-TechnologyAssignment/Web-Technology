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
var foursquare = require("../lib/foursquare");
var db = require("../lib/db");

var counter;
var max_length;
var venues;
var user;
router.get('/foursquare', function(req, res, next) {
    var query = req.query;
    if (query.name == null || query.name.length == 0) {
        console.log(query.name);
        res.render('foursquare', {title: 'Search FourSquare!'});
    } else {
        var day = new Date();
        day.setDate(day.getDate() - query.day);
        var q = {q: "from:" + query.name + " swarmapp" + " since:" + day.getFullYear() + "-0"
        + (day.getMonth() + 1) + "-" + day.getDate() , count: 15};
        console.log(q);
        client.get("search/tweets", q, function (err, data) {
            counter = 0;
            max_length = data.statuses.length;
            venues = [];
            if (data.statuses.length != 0) {
                for (var index in data.statuses) {
                    var tweet = data.statuses[index];
                    var user = tweet.user;
                    var url = util.getURL(tweet.text);
                    util.expandURL(url, function (checkin) {
                        foursquare.get("checkins/resolve", {shortId: checkin}, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var data = JSON.parse(body);
                                var venue_info = data.response.checkin.venue;
                                foursquare.get("venues/" + venue_info.id, {}, function (err, resp, value) {
                                    value = JSON.parse(value);
                                    var venue = value.response.venue;
                                    var loc = venue.location;
                                    var photos = venue.photos.groups;
                                    var categories = "";
                                    for (var i in venue.categories) {
                                        categories += venue.categories[i].name;
                                    }
                                    if (photos.length != null && photos.length != 0) {
                                        photos = photos[0].items;
                                        photos = photos[0].prefix + "100" + photos[0].suffix;
                                    } else {
                                        photos = null;
                                    }
                                    venues.push({ name: venue.name,
                                        venueId: venue.id,
                                        loc: {lat: loc.lat, lng: loc.lng},
                                        photo: photos,
                                        categories: categories,
                                        address: loc.formattedAddress.toString(),
                                        url: venue.canonicalUrl
                                    });
                                    counter++;
                                    if (counter == max_length) {
                                        db.storeVenues(venues, user);
                                        res.render('foursquare', {title: 'Search FourSquare!', venues: venues});
                                    }
                                });
                            } else {
                                res.render('foursquare', {title: 'Search FourSquare!', error: "No result"});
                            }
                        });
                        console.log(checkin);
                    });
                }
            } else {
                res.render('foursquare', {title: 'Search FourSquare!', error: "No result"});
            }
        });


    }

});

module.exports = router;
