/**
 * Created by Paul on 2015/5/23.
 */
var count = {};

count.countKeywords = function (text,param) {
    text = text.replace(/\w+?:\/\/\S+/g, "");
    var regex = /\w+(?:'\w{1,2})?/g;
    var matches;
    while ((matches = regex.exec(text)) != null)
    {
        var word = matches[0].toLowerCase();
        if (typeof param[word] == "undefined") {
            param[word] = 1;
        } else {
            param[word]++;
        }
    }
    return param;
};

count.commonKeywords = function(param, num) {
    var dictionary = [];    // json to array
    var common_words = [];
    var users = [];
    var result = {};
    for (var user in param) {
        dictionary.push(param[user]);
        users.push(user);
    }
    for (var key in dictionary[0]) {
        var isCommon = true;
        var sum = 0;
        for (var i = 1; i < dictionary.length; i++) {
            var temp = dictionary[i][key];
            if (temp == null) {
                isCommon = false;
                break;
            }
            sum += temp;
        }
        if (isCommon) {
            common_words.push({ key :key, total: sum});
        }
    }
    // find total
    common_words.sort(function (a, b) {
        return b.total - a.total;
    });
    console.log(common_words);
    // return result
    var counter = 0;
    for (var i = 0; i < num ; i++) {

    }
};

module.exports = count;