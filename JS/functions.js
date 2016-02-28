'use strict';
var c = require('./constants.js');

var diacriticsMap = {};


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
    if (typeof n !== "number") return false;
    if (n == 0 || n == 1) return false;
    if (n == 2 || n == 3) return true;
    if (n % 2 == 0) return false;

    var limit = Math.sqrt(n);
    var i = 3;
    var isPrimeNumber = true;
    while (isPrimeNumber && i <= limit) {
        if (isInt(n / i)) {
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
 * @param internalArray Use for recursivity. You should not give anything here. Just leave it undefined.
 */
function findPrimeDivisors(n, internalArray) {
    var divisors = findDivisors(n, false);
    var indexDivisor = 0;
    var primeDivisorsArray = typeof internalArray === "undefined" ? [] : internalArray;
    var getNextPrimeDivisor = function () {
        if (indexDivisor < divisors.length && isPrimeNumber(divisors[indexDivisor])) {
            indexDivisor++;
            return divisors[indexDivisor - 1];
        } else if (indexDivisor + 1 < divisors.length) {
            indexDivisor++;
            return getNextPrimeDivisor();
        } else {
            return false;
        }
    };

    var d;
    var e;
    d = getNextPrimeDivisor();
    if (d === false) {
        primeDivisorsArray.push(n);
        return primeDivisorsArray;
    } else {
        primeDivisorsArray.push(d);
        e = findPrimeDivisors(n / d, primeDivisorsArray);
    }
    return primeDivisorsArray;
}

function removeDuplications(ar) {
    for (var i = 0; i < ar.length; i++) {
        for (var j = 0; j < ar.length; j++) {
            if (i != j && ar[i] == ar[j]) {
                ar.splice(j, 1);
            }
        }
    }
    return ar;
}

/**
 * Return an array of values that can be found in one of arrays
 * @param ar1
 * @param ar2
 * @returns {Array}
 */
function mergeArrays(ar1, ar2) {
    for (var i = 0; i < ar1.length; i++) {
        ar2.push(ar1[i]);
    }
    return ar2;
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
        mergeArrays: mergeArrays,
        removeDuplications: removeDuplications
    }
};
