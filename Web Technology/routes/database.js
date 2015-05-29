
var express = require('express'),
router  = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host    :   'stusql.dcs.shef.ac.uk',
    user    :   'acp14xw',
    password:   '7f2a6ead',
    database:   'acp14xw'
});
var init = false;
var query = function (query, callback) {
    if (!init) {
        connection.connect();
        init = true;
    }
    connection.query(query), function(err, rows, fields) {
        if (err) {
            console.log(err);
            //throw err;
        }
        console.log(rows);
    };
};
/* GET a username*/
router.get('/queryInterface', function(req, res, next) {
    console.log(req.query);
    req.query.usernames,function(users)

    var query= 'SELECT * FROM user inner join visit ON user.screenName = visit.screenName WHERE userName LIKE "' + usr +
                '%"' + 'OR id LIKE "%"';
    connection.query(query,function(err, rows)
    {
        console.log(rows);
        if (err)
            console.log(err);

        res.render('queryInterface', {title: "Database query"});
});
};
/* GET a user id*/
router.get('/queryInterface', function(req, res, next) {
    console.log(req.query);

    var query= 'SELECT * FROM user inner join visit ON user.screenName = visit.screenName WHERE userName LIKE "' + usr +
               '%"' + 'OR id LIKE "%"';
    connection.query(query,function(err, rows)
    {
        if (err)
            console.log(err);

        res.render('queryInterface', {title: "Database query"});
}

/* Get users names who visited a particular venue from database*/
router.get('/queryInterface', function(req, res, next) {
    var query= 'select screenName from location join venue on (user_venues.venue_id = venues.venueId)where name = "'+venue+'"';
    connection.query('select user_id from user_venues join venues on (user_venues.venue_id = venues.venue_id)where name = "'+venue+'"',function(err, rows)
    {
        if (err)
            console.log(err)
        callback(rows);
        //console.log(rows);
    });
    res.render('queryInterface', {title: "Database query"});
});
module.exports = router;

