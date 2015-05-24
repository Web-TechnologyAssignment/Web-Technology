var request = require('request');
var foursquare = {};
// set headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

var config = {
    id : 'PV0EB3H5TB4GYSUKY5QXAZIXVQYTNJ42FUUVS1TSHAIQSNS3',
    secret : 'BNAPIJU4L5NVQPBNA4OI40KZ1OZSWD5YT0UZLCHVCTWCQ4JV'
}

// configure the request
var options = {
    url: 'https://api.foursquare.com/v2',
    method: "GET",
    headers: headers,
    qs: {
        client_id: config.id,
        client_secret: config.secret
    }
}

foursquare.get = function(path, params, callback) {
    console.log("start: ");
    var a = {city: "kengdie", life: "bad"};
    var b = {city: "kengdie", life: "bad"};
    console.log();
};

module.exports = foursquare;