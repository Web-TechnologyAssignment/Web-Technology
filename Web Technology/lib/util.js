 /**
 * Created by Paul on 2015/5/26.
 */
var util = {};
var request = require("request");
var foursquare = require("./foursquare");

// expand short url
util.expandURL = function(url, callback) {
    // set request
    request({
        method: "HEAD",
        url: url,
        followAllRedirects: true
    }, function(error,response) {
        console.log(url);
        var href = response.request.href;
        // get checkin ID
        var checkin = href.substring(href.lastIndexOf("/") + 1);
        callback(checkin, url);
    });
};

// get the first url from a tweet
util.getURL = function(text, callback) {
    var regex = /\w+?:\/\/\S+/g;
    var matches;
    if ((matches = regex.exec(text)) != null)
    {
        return matches[0];
    }
    return null;
};


module.exports = util;