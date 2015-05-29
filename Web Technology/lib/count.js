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
    var common_words = [];
    if (param.length < 1) {
        return param;
        // do something else
    } else {
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
            if (isCommon) {
                common_words.push({key: key, total: sum});
            }
        }
    }


    // find total
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