/**
 * Every uppercase char is transformed into uppercase char.
 * Remove every char that is not between a-z or 0-9.
 * @param str
 * @returns {string}
 */
function satinize(str, removeWhiteSpaces) {
    removeWhiteSpaces = typeof removeWhiteSpaces === "boolean" ? removeWhiteSpaces : false;
    str = removeDiacritics(str);
    str = str.toUpperCase();
    if(removeWhiteSpaces) {
        return str.replace(/[^a-z0-9]/gmi, '');
    } else {
        return str.replace(/[^a-z0-9\s]/gmi, '');
    }
}

var diacriticsMap = {};
for (var i=0; i < defaultDiacriticsRemovalap.length; i++){
    var letters = defaultDiacriticsRemovalap[i].letters;
    for (var j=0; j < letters.length ; j++){
        diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
    }
}
/**
 * Replace every special char with the normal corresponding char.
 * e.g. :  é become e
 * @param str
 * @returns {string|void|XML}
 */
function removeDiacritics (str) {
    return str.replace(/[^\u0000-\u007E]/g, function(a){
        return diacriticsMap[a] || a;
    });
}