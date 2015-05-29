/**
 * Created by Paul on 2015/5/28.
 */
var db = {};
var mysql = require('mysql');

// using connection pool to manage database connection
var pool = mysql.createPool({
    host    :   'stusql.dcs.shef.ac.uk',
    user    :   'acp14xw',
    password:   '7f2a6ead',
    database:   'acp14xw'
});

// all sql queries are executed by this function
db.query = function (query, callback) {
    pool.getConnection(function(err, connection) {
        connection.query(query, function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                if (callback) {
                    callback(rows);
                }
            }
        });
        connection.release();
    });
};

// store the information of users in database
db.storeUsers = function(users) {
    if (users != null && users.length != 0) {
        // if the screen name is the same, then overwrite the data
        var prefix = 'INSERT INTO user(screenName,userName,location,photo,text) VALUES ';
        var suffix = ' ON DUPLICATE KEY UPDATE userName = VALUES(userName),screenName = VALUES(screenName), ' +
            'location = VALUES(location), photo = VALUES(photo), text = VALUES(text);';
        var q = '';
        for (var i in users) {
            var user = users[i];
            q = q + '("' + user.screen_name + '","' + user.name + '","' + user.location + '","' + user.photo +
            '","' + user.text + '")';
            if (i != (users.length - 1)) {
                q += ','
            }
        }
        var query = prefix + q + suffix;
        console.log(query);
        db.query(query);
    }
}

// store venues with the users who visited the veneus
db.storeVenues = function (venues, user) {
    if (venues && user) {
        // inser venues and users first
        var insertUser = 'INSERT INTO user(screenName,userName,location,photo,text) VALUES ' +
            '("' + user.screen_name + '","' + user.name + '","' + user.location + '","' +
            user.profile_image_url + '","' + user.description + '")' +
            ' ON DUPLICATE KEY UPDATE userName = VALUES(userName),screenName = VALUES(screenName), ' +
            'location = VALUES(location), photo = VALUES(photo), text = VALUES(text);';
        db.query(insertUser);
        var prefix = 'INSERT INTO venue(venueId,venueName) VALUES ';
        var suffix = ' ON DUPLICATE KEY UPDATE venueId = VALUES(venueId),venueName = VALUES(venueName);';
        var q = '';
        var qVisit = '';
        for (var i in venues) {
            var venue = venues[i];
            console.log(venue);
            q = q + '("' + venue.venueId + '","' + venue.name + '")';
            qVisit = qVisit + '("' + venue.venueId + '","' + user.screen_name + '")';
            if (i != (venues.length - 1)) {
                q += ',';
                qVisit += ',';
            }
        }
        console.log(prefix + q + suffix);
        db.query(prefix + q + suffix);

        // insert visit record
        prefix = 'INSERT INTO visit(venueId,screenName) VALUES ';
        suffix = ' ON DUPLICATE KEY UPDATE venueId = VALUES(venueId),screenName = VALUES(screenName);';
        db.query(prefix + qVisit + suffix);
    }
};

// store venues with the users who visited the veneus
db.storeVenuesWithUser = function (venues) {
    console.log(venues.users);
    for (var i in venues.venues) {
        var venue = venues.venues[i];
        var shortUrl = venues.checkin[i].shortUrl;
        var user = venues.users[shortUrl].user;
        console.log(user);
        console.log(shortUrl);
        if (user != null && shortUrl!= null && venue!= null) {
            console.log("query started.");
            var insertUser = 'INSERT INTO user(screenName,userName,location,photo,text) VALUES ' +
                '("' + user.screen_name + '","' + user.name + '","' + user.location + '","' +
                user.photo + '","' + user.text + '")' +
                ' ON DUPLICATE KEY UPDATE userName = VALUES(userName),screenName = VALUES(screenName), ' +
                'location = VALUES(location), photo = VALUES(photo), text = VALUES(text);';
            db.query(insertUser);
            var insertVenue = 'INSERT INTO venue(venueId,venueName) VALUES ' + '("' + venue.id +
                '","' + venue.name + '")'+ ' ON DUPLICATE KEY UPDATE venueId = VALUES(venueId),' +
                'venueName = VALUES(venueName);';
            db.query(insertVenue);
            var insertVisit = 'INSERT INTO visit(venueId,screenName) VALUES ' + '("' + venue.id +
                '","' + user.screen_name + '")'+ ' ON DUPLICATE KEY UPDATE venueId = VALUES(venueId),' +
                'screenName = VALUES(screenName);';
            db.query(insertVisit);
        }
    }
};

module.exports = db;