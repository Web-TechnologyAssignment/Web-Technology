var express = require('express'),
router  = express.Router();

// using db from lib to query from mysql database
var db = require('../lib/db');

// query database
router.get('/queryInterface.html', function(req, res, next) {
    var query = req.query;
    var sql = "";
    if (query.input) {
        // user could choose search by user name, user id, venue name
        if (query.select == "venue") {
            sql = "SELECT * FROM venue A LEFT JOIN (visit B INNER JOIN user C) ON" +
                " A.venueId = B.venueId AND B.screenName = C.screenName " +
                "WHERE A.venueName LIKE '%" + query.input + "%';";
        } else if (query.select == "username") {
            sql = "SELECT * FROM (venue A INNER JOIN visit B) RIGHT JOIN user C ON " +
                "A.venueId = B.venueId AND B.screenName = C.screenName " +
                "WHERE C.userName LIKE '%" + query.input + "%';";
        } else if (query.select == "userID") {
            sql = "SELECT * FROM (venue A INNER JOIN visit B) RIGHT JOIN user C ON " +
                "A.venueId = B.venueId AND B.screenName = C.screenName " +
                "WHERE C.screenName LIKE '%" + query.input + "%';";
        }
        console.log(sql);
        db.query(sql, function (rows) {
            console.log(query.select);
            console.log(rows);
            console.log(query.select);
            res.render('queryInterface', {title: "Database Query", results: rows, select: query.select});
        });

    } else {
        res.render('queryInterface', {title: "Database Query"});
    }

});

module.exports = router;

