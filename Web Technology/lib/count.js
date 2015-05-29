/**
 * Created by Paul on 2015/5/23.
 */
var count = {};

count.countKeywords = function (text,param) {
    // remove any url in the text
    text = text.replace(/\w+?:\/\/\S+/g, "");
    // find single word
    var regex = /\w+(?:'\w{1,2})?/g;
    var matches;
    while ((matches = regex.exec(text)) != null)
    {
        // counting the frequency of word
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
    var common_words = [];
    if (param.length < 1) {
        return param;
    } else {
        // find common word
        // if only have one text, then all every keyword is common
        for (var key in param[0].words) {
            var isCommon = true;
            var sum = param[0].words[key];
            for (var i = 0; i < param.length; i++) {
                var temp = param[i].words[key];
                if (temp == null) {
                    isCommon = false;
                    break;
                }
                sum += temp;
            }
            // push all common keywords in an array
            if (isCommon) {
                common_words.push({key: key, total: sum});
            }
        }
    }

    // sort common keywords descending
    common_words.sort(function (a, b) {
        return b.total - a.total;
    });

    // find the top num's
    if (common_words.length >= num) {
        common_words = common_words.slice(0,num);
    }

    // return result
    param.push({ total: common_words });
    return param;
};

module.exports = count;