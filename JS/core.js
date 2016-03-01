'use strict';

var f = require('./functions.js')();
var c = require('./constants.js');

var process = function (text, onDone) {
    var satinizedText = f.satinize(text, true);
    var freqC = analyze.getCharFrequency(satinizedText);
    var IC = analyze.getIndexOfCoincidence(freqC);
    var vigenereEncrypted = encrypt.vigenere(text, "MUSIQUE");
    var vigenereDecrypted = decrypt.vigenere(vigenereEncrypted, "MUSIQUE");
    onDone(freqC, IC);
};
var encrypt = {
    vigenere: function (str, key) {
        str = f.satinize(f.removeDiacritics(str.toUpperCase()), true);
        var keyCharAlphabetIdx;
        var originalCharAlphabetIdx;
        var cryptedCharAlphabetIdx;
        var keyIdx = 0;
        var cryptedStr = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) >= c.FIRST_LETTER_UPPERCASE_ASCII_INDEX && str.charCodeAt(i) <= c.LAST_LETTER_UPPERCASE_ASCII_INDEX) {
                keyCharAlphabetIdx = key[keyIdx].charCodeAt(0) - c.FIRST_LETTER_UPPERCASE_ASCII_INDEX;
                originalCharAlphabetIdx = str[i].charCodeAt(0) - c.FIRST_LETTER_UPPERCASE_ASCII_INDEX;
                cryptedCharAlphabetIdx = (originalCharAlphabetIdx + keyCharAlphabetIdx) % c.NB_LETTERS_ALPHABET;
                cryptedStr += String.fromCharCode(cryptedCharAlphabetIdx + c.FIRST_LETTER_UPPERCASE_ASCII_INDEX);

                keyIdx = (keyIdx + 1) % key.length;
            } else {
                cryptedStr += str[i];
            }
        }
        return cryptedStr;
    }
};
var decrypt = {
    vigenere: function (cryptedStr, key) {
        var decryptedStr = "";
        var originalChar;
        var originalCharCode;
        var cryptedChar;
        var cryptedCharCode;
        var cryptedAlphabetIdx;
        var keyIdx = 0;
        var keyAlphabetIdx;
        for (var i = 0; i < cryptedStr.length; i++) {
            cryptedChar = cryptedStr[i];
            cryptedCharCode = cryptedChar.charCodeAt(0);
            cryptedAlphabetIdx = cryptedCharCode - c.FIRST_LETTER_UPPERCASE_ASCII_INDEX;
            if (cryptedAlphabetIdx >= 0 && cryptedAlphabetIdx <= c.NB_LETTERS_ALPHABET - 1) {
                keyAlphabetIdx = key.charCodeAt(keyIdx) - c.FIRST_LETTER_UPPERCASE_ASCII_INDEX;
                originalCharCode = (cryptedAlphabetIdx - keyAlphabetIdx) % c.NB_LETTERS_ALPHABET;
                originalCharCode = originalCharCode < 0 ? originalCharCode + c.NB_LETTERS_ALPHABET : originalCharCode;
                originalChar = String.fromCharCode(originalCharCode + c.FIRST_LETTER_UPPERCASE_ASCII_INDEX);

                decryptedStr += originalChar;
                keyIdx = (keyIdx + 1) % key.length;
            } else {
                decryptedStr += cryptedChar;
            }
        }
        return decryptedStr;
    }
};
var analyze = {
    getVigenereCipherArray: function () {//Useless
        console.group("Vigenere Cipher");
        console.time("vigenere_ciphere");
        var ar = [];
        var col_char;
        var lin_char;
        var elem_char;
        for (var i = 0; i < c.NB_LETTERS_ALPHABET; i++) {
            lin_char = String.fromCharCode(i + c.FIRST_LETTER_UPPERCASE_ASCII_INDEX);
            ar[lin_char] = [];
            for (var j = 0; j < c.NB_LETTERS_ALPHABET; j++) {
                col_char = String.fromCharCode(j + c.FIRST_LETTER_UPPERCASE_ASCII_INDEX);
                var idx_alphabet_char = (i + j) % c.NB_LETTERS_ALPHABET;
                elem_char = String.fromCharCode(c.FIRST_LETTER_UPPERCASE_ASCII_INDEX + idx_alphabet_char);
                ar[lin_char][col_char] = elem_char;
            }
        }
        console.timeEnd("vigenere_ciphere");
        console.groupEnd();
        return ar;
    },
    getCharFrequency: function (str) {
        /**
         * Count the frequence of every char that is between a-z or 0-9.
         * It ignore uppercase characters.
         * @param str
         * @returns {{}}
         */
        str = str.toUpperCase();
        var strLen = str.length;
        var char_frequency = {};

        //from a to z
        for (var i = c.FIRST_LETTER_UPPERCASE_ASCII_INDEX; i < c.LAST_LETTER_UPPERCASE_ASCII_INDEX; i++) {
            var ch = String.fromCharCode(i);
            char_frequency[ch] = {
                count: 0,
                frequency: 0
            }
        }

        //from 0 to 9
        for (i = 0; i <= 9; i++) {
            char_frequency[i] = {
                count: 0,
                frequency: 0
            }
        }

        //counting
        for (i = 0; i < str.length; i++) {
            ch = str[i];
            if (char_frequency.hasOwnProperty(ch)) {
                char_frequency[ch].count++;
            }
        }

        //frequency
        for (var key in char_frequency) {
            if (char_frequency.hasOwnProperty(key)) {
                char_frequency[key].frequency = (char_frequency[key].count / strLen) * 100;
            }
        }
        return char_frequency;
    },
    getIndexOfCoincidence: function (input, searchClosestLanguage) {
        var curIdxOfCoincidence = 0;
        var nbTotalLetters = 0;
        searchClosestLanguage = typeof searchClosestLanguage === "boolean" ? searchClosestLanguage : true;

        var distance = Number.MAX_VALUE;
        var closestIdxOfCoincidence;

        if (typeof input === "object") {
            var freqObj = input;
        } else if (typeof input === "string") {
            var char_frequency = [];
            //from a to z
            for (var i = c.FIRST_LETTER_UPPERCASE_ASCII_INDEX; i <= c.LAST_LETTER_UPPERCASE_ASCII_INDEX; i++) {
                var ch = String.fromCharCode(i);
                char_frequency[ch] = {count: 0};
            }
            //from 0 to 9
            for (i = 0; i <= 9; i++) {
                char_frequency[i] = {count: 0};
            }
            //counting
            for (i = 0; i < input.length; i++) {
                ch = input[i];
                if (char_frequency.hasOwnProperty(ch)) {
                    char_frequency[ch].count++;
                }
            }
            freqObj = char_frequency;
        }

        for (var key in freqObj) {
            if (freqObj.hasOwnProperty(key)) {
                nbTotalLetters += freqObj[key].count;
            }
        }
        for (key in freqObj) {
            if (freqObj.hasOwnProperty(key) && freqObj[key].count > 0) {
                curIdxOfCoincidence += (freqObj[key].count * (freqObj[key].count - 1)) / (nbTotalLetters * (nbTotalLetters - 1));
            }
        }
        var returnObj;
        if (searchClosestLanguage) {
            for (i = 0; i < languagesIdxOfCoincidence.length; i++) {
                var curDist = Math.abs(languagesIdxOfCoincidence[i][1] - curIdxOfCoincidence);
                if (curDist < distance) {
                    closestIdxOfCoincidence = i;
                    distance = curDist;
                }
            }
            returnObj = [languagesIdxOfCoincidence[closestIdxOfCoincidence][0], curIdxOfCoincidence];

        } else {
            returnObj = curIdxOfCoincidence;
        }
        return returnObj;
    },
    vigenere: function (cryptedText) {
        var charF = this.getCharFrequency(cryptedText);
        cryptedText = f.satinize(cryptedText, true);
        for (var nbLet = 2; nbLet < 10; nbLet++) {
            var pattern = "([a-zA-Z0-9]{1," + nbLet + "})";
            var regex = new RegExp(pattern, "g");
            var matches = cryptedText.match(regex);
            //calculate IC for each matches
            for (var matchIdx = 0; matchIdx < matches.length - 1; matchIdx++) {
                var idx = this.getIndexOfCoincidence(matches[matchIdx], false);
                console.log(idx + "  " + matches[matchIdx]);
                if (idx == 0) { //Ignorer
                    console.log(matches[matchIdx]);
                } else {
                    //Put in array
                }
            }
        }
    },
    //D�terminer la taille de la clef � partir des x-grammes
    // Probleme : Tous les diviseurs de chaque distance trouvé ne sont pas à prendre en cours. Cela fausse l'automatisation
    findKeyByXGrams: function (str, min, max) {
        if (typeof str !== "string" || str.length == 0) {
            return false;
        }
        min = typeof  min === "number" ? min : 3;
        max = typeof  max === "number" ? max : str.length / 2;
        var xgram = "";
        var res = {};
        var divisorsArray = [];
        var uniqueDivisorFound = false;
        var nbLetters = min;
        var i;
        while (!uniqueDivisorFound && nbLetters <= max) {
            res[nbLetters] = {};
            i = 0;
            while (!uniqueDivisorFound && i < (str.length - nbLetters + 1)) {
                xgram = str.substr(i, nbLetters);
                var ar = f.subStrIndexes(str, xgram);
                if (ar.length > 1) {
                    res[nbLetters][xgram] = ar;
                    res[nbLetters][xgram]["distance"] = Math.abs(ar[0] - ar[1]);
                    res[nbLetters][xgram]["divisors"] = f.findDivisors(res[nbLetters][xgram]["distance"]);
                    if (res[nbLetters][xgram]["divisors"].length > 0) {
                        divisorsArray = divisorsArray.length == 0 ? res[nbLetters][xgram]["divisors"] : f.joinArrays(res[nbLetters][xgram]["divisors"], divisorsArray);
                    }
                    console.log(res[nbLetters][xgram]["distance"]+"  "+res[nbLetters][xgram]["divisors"]);
                    console.log(divisorsArray);
                    if (divisorsArray.length == 1) {
                        uniqueDivisorFound = true;
                    }
                }
                i++;
            }
            var nbKeys = Object.keys(res[nbLetters]).length;
            if (nbKeys == 0) {
                delete res[nbLetters];
            } else {
                console.log(nbKeys + " cas de duplications de " + nbLetters + "-grammes.");
            }
            nbLetters++;
        }
        /*
         divisorsArray = f.removeDuplications(divisorsArray);
         console.log(divisorsArray.sort(function (a, b) {
         if (a > b) return -1;
         if (a < b) return 1;
         return 0;
         }));*/
        //console.log(res);
        return uniqueDivisorFound;
    }
};


exports.process = process;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.analyze = analyze;