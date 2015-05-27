var request = require('request');
var foursquare = {};
// set headers
var headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Content-Type': 'application/x-www-form-urlencoded'
}

var config = {
    id : 'PV0EB3H5TB4GYSUKY5QXAZIXVQYTNJ42FUUVS1TSHAIQSNS3',
    secret : 'BNAPIJU4L5NVQPBNA4OI40KZ1OZSWD5YT0UZLCHVCTWCQ4JV',
    access_token : "LSAKYLRWX33ZPTQIOQZOXCLMPEDB2EOMZ3E14JD30NU2DIUB"
}

// configure the request
var options = {
    url: 'https://api.foursquare.com/v2/',
    method: "GET",
    headers: headers,
    qs: {
        oauth_token: config.access_token,
        v: 20150527
    }
}

foursquare.get = function(path, params, callback) {
    options.url = 'https://api.foursquare.com/v2/' + path;
    if (params.shortId) {
        options.qs['shortId'] = params.shortId;
    }

    request(options, function (error, response, body){
        callback(error, response, body);
    });
};

module.exports = foursquare;