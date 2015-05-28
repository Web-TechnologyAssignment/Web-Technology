/**
 * Created by Paul on 2015/5/28.
 */
var db = {};
var mysql = require('mysql');

var connection = mysql.createConnection({
    host    :   'stusql.dcs.shef.ac.uk',
    user    :   'acp14xw',
    password:   '7f2a6ead',
    database:   'acp14xw'
});
var init = false;
db.query = function (query, callback) {
    if (!init) {
        connection.connect();
        init = true;
    }
    connection.query(query), function(err, rows, fields) {
        if (err) throw err;
        console.log(rows);
    };
};

db.storeUsers = function(users) {
    if (users != null && users.length != 0) {
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
        console.log('Query: ');
        console.log(query);
        db.query(query);
    }
}

module.exports = db;