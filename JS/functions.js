var c = require('./constants.js');

var diacriticsMap = {};


function help() {
    console.log("Usage : ");
    console.log("-e|-d|-a   -fi|-si|-ti path|string   [-fo outputpath] -k keystring");
    console.log("-e : Encrypt the input stream with the given key");
    console.log("-d : Decrypt the input stream with the given key");
    console.log("-a : Analyze the input stream to find the key length and try to decrypt it.");

    console.log("-fi -si -ti specify input stream");
    console.log("-fi for a file, next argument should be a path");
    console.log("-si for a string, next argument is the string");
    console.log("-ti for one of programs texts. See TEXT Directory, next argument should be the name of the file without extension.");
    console.log("-fo redirect the output in a file");
    console.log("if -fo is not specified, the result of the command is display.");
}
/**
 * Every lowercase char is transformed into uppercase char.
 * Remove every char that is not between A-Z or 0-9.
 * @param str
 * @param removeWhiteSpaces False if you want to keep spaces
 * @returns {string}
 */
function satinize(str, removeWhiteSpaces) {
    removeWhiteSpaces = typeof removeWhiteSpaces === "boolean" ? removeWhiteSpaces : false;
    str = removeDiacritics(str);
    str = str.toUpperCase();
    if (removeWhiteSpaces) {
        return str.replace(/[^a-z0-9]/gmi, '');
    } else {
        return str.replace(/[^a-z0-9\s]/gmi, '');
    }
}

/**
 * Replace every special char with the normal corresponding char.
 * e.g. :  � become e
 * @param str
 * @returns {string|void|XML}
 */
function removeDiacritics(str) {
    return str.replace(/[^\u0000-\u007E]/g, function (a) {
        return diacriticsMap[a] || a;
    });
}

function subStrIndexes(str, searchStr) {
    var regex = new RegExp(searchStr, "gm");
    var idxs = [];
    var i = 0;
    while (idxs[i] = regex.exec(str)) {
        idxs[i] = idxs[i].index;
        i++;
    }
    idxs.pop(); //Last element is null
    return idxs;
}

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

function isPrimeNumber(n) {
    if (n == 0 || n == 1 || n % 2 == 0) return false;
    if (n == 2 || n == 3) return true;

    var limit = Math.sqrt(n);
    var i = 3;
    var isPrimeNumber = true;
    while (isPrimeNumber && i <= limit) {
        if (isInt(n / i)) {
            console.log(i + " can divide " + n + " = " + (n / i));
            isPrimeNumber = false;
        }
        i++;
    }
    return isPrimeNumber;
}

/**
 * Return an array of all numbers that can divide given n.
 * @param n
 * @param giveObviousDivisors True if you also want 1 and n in the array. False by default
 */
function findDivisors(n, giveObviousDivisors) {
    giveObviousDivisors = typeof giveObviousDivisors === "boolean" ? giveObviousDivisors : false;
    var limit = n;
    var d = 2;
    var divisors = [];
    if (giveObviousDivisors)
        divisors.push(1);
    while (d < limit) {
        if (isInt(n / d)) {
            divisors.push(d);
        }
        d = d + 1;
    }
    if (giveObviousDivisors)
        divisors.push(n);
    return divisors;
}

/**
 * Return an array of all primary numbers that can divide given n.
 * @param n
 * @param giveObviousDivisors True if you also want 1 and n in the array. False by default
 *///TODO
function findPrimeDivisors(n, giveObviousDivisors) {
    giveObviousDivisors = typeof giveObviousDivisors === "boolean" ? giveObviousDivisors : false;
    var limit = Math.sqrt(n);
    var d = 2;
    var divisors = [];
    if (giveObviousDivisors)
        divisors.push(1);
    while (d < limit) {
        if (isInt(n / d)) {
            divisors.push(d);
        }
        d = d + 1;
    }
    if (giveObviousDivisors)
        divisors.push(n);
    return divisors;
}

/**
 * Return an array of values that can be found in both given arrays
 * @param ar1
 * @param ar2
 * @returns {Array}
 */
function joinArrays(ar1, ar2) {
    var finalArray = [];
    var contain = function (arr, val) {
        var found = false;
        var i = 0;
        while (!found && i < arr.length) {
            if (arr[i] === val) {
                found = true;
            }
            i++;
        }
        return found;
    };
    for (var j = 0; j < ar1.length; j++) {
        if (contain(ar2, ar1[j])) {
            finalArray.push(ar1[j]);
        }
    }
    return finalArray;
}

module.exports = function () {
    for (var i = 0; i < c.defaultDiacriticsRemovalap.length; i++) {
        var letters = c.defaultDiacriticsRemovalap[i].letters;
        for (var j = 0; j < letters.length; j++) {
            diacriticsMap[letters[j]] = c.defaultDiacriticsRemovalap[i].base;
        }
    }
    return {
        satinize: satinize,
        removeDiacritics: removeDiacritics,
        subStrIndexes: subStrIndexes,
        isInt: isInt,
        isFloat: isFloat,
        isPrimeNumber: isPrimeNumber,
        findDivisors: findDivisors,
        findPrimeDivisors: findPrimeDivisors,
        joinArrays: joinArrays,
        help: help
    }
};
