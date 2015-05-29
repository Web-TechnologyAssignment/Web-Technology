var express = require('express'),
router  = express.Router();
var mysql = require('mysql');

var db = require('../lib/db');
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


router.get('/queryInterface.html', function(req, res, next) {
    var query = req.query;
    var sql = "";
    if (query) {
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

