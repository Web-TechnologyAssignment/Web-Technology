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

var places = [];

router.get('/additional', function(req, res, next) {
    var query = req.query;
    if (query.loc != null && query.loc.length != 0) {
        client.get("geo/search", { query: "sheffield university"}, function(err, data) {
            places = [];
            for (var i in data.result.places) {
                var place = data.result.places[i];
                places.push({name: place.name,
                    full_name: place.full_name,
                    country: place.country,
                    centre: place.centroid,
                    place_type: place.place_type
                });
                //console.log(place.bounding_box);
            }
            console.log(data.result.places[0]);
            res.render('additional', {title: 'Test additional features', places: places});
        });
    } else {
        res.render('additional', {title: 'Test additional features'});
    }
});

router.get('/additional/search', function(req, res, next) {
    console.log(req.query);
    var venues = [];
    var centre = req.query.centre.split(",");
    if (centre) {
        foursquare.get("venues/search", { ll: centre[1] +"," + centre[0], limit: 10, radius: 500}, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                for (var i in data.response.venues) {
                    var venue = data.response.venues[i];
                    var loc = venue.location;
                    if (!loc.formattedAddress) {
                        loc.formattedAddress = "";
                    } else {
                        loc.formattedAddress = loc.formattedAddress.toString();
                    }
                    var categories = "";
                    for (var i in venue.categories) {
                        categories += venue.categories[i].name;
                    }
                    venues.push({
                        name: venue.name,
                        categories: categories,
                        address: venue.location.formattedAddress
                    });
                }
                console.log(venues);
                res.render('search', {title: "Search Result", venues: venues});
            }
        });
    } else {
        res.render('search', {title: "Search Result"});

    }
});

module.exports = router;
