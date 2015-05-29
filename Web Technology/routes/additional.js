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
var foursquare = require("../lib/foursquare");

var places = [];
// handle additional
router.get('/additional', function(req, res, next) {
    var query = req.query;
    // user can choose location/coordinates/venue
    if (query.loc != null && query.loc.length != 0) {

        // as user choose location
        if (query.select == "location") {
            client.get("geo/search", { query: query.loc}, function(err, data) {
                places = [];
                for (var i in data.result.places) {
                    var place = data.result.places[i];
                    var temp = place.centroid[0];

                    // use centroid of an area to search venues
                    place.centroid[0] = place.centroid[1];
                    place.centroid[1] = temp;
                    console.log(place.centroid);
                    places.push({name: place.name,
                        full_name: place.full_name,
                        country: place.country,
                        centre: place.centroid.toString(),
                        place_type: place.place_type
                    });
                    //console.log(place.bounding_box);
                }
                res.render('additional', {title: 'additional features', places: places});
            });

        }
        // as user choose coordinates
        else if (query.select == "coordinates"){
            searchCoordinates(req, res, next);
        }
        // as user choose venue
        else if (query.select == "venue") {
            searchVenue(req, res, next);
        }
    } else {
        // default page
        res.render('additional', {title: 'additional features'});
    }
});

// if user click the link in the search result
router.get('/additional/search', searchCoordinates);

// find the venues by a specific coordinates
// in radius of 500 meters
function searchCoordinates(req, res, next)  {
    var query = req.query;
    var venues = [];
    var centre;
    console.log(query);
    if (query.loc) {
        centre = req.query.loc.split(",");
    } else {
        centre = req.query.centre.split(",");
    }
    if (centre) {
        // using foursquare api venues/search by the latitude and longitude
        foursquare.get("venues/search", { ll: centre[0] +"," + centre[1], limit: 50, radius: 500}, function(error, response, body) {
            if (!error && response.statusCode == 200) {

                // get json data from server
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
                res.render('search', {title: "Search Result", venues: venues});
            }
        });
    } else {
        // default page
        res.render('search', {title: "Search Result"});
    }
}

// search venues around a venue by its venue id
function searchVenue(req, res, next) {

    var id = req.query.loc;
    var venues;
    if (id && id.length != 0) {
        // using forusquare api  Venues : nextvenues
        foursquare.get("venues/" + id + "/nextvenues", {}, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                venues = [];
                var data = JSON.parse(body);
                for (var i in data.response.nextVenues.items) {
                    var venue = data.response.nextVenues.items[i];
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
                res.render('search', {title: "Search Result", venues: venues});
            }
        });
    } else {
        // default page
        res.render('search', {title: "Search Result"});
    }
}
module.exports = router;
