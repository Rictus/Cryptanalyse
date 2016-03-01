'use strict';

var constants = require('./constants.js');
var core = require('./core.js');
var textExamples = require('./texts.js');
var f = require('./functions.js')();
var bigNumber = require('bignumber');

String.prototype.replaceAt = function (index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
};

String.prototype.spaceSeparate = function () {
    return this.split('').join(' ');
};


function firstTry() {
    var t = textExamples.getContent('lecorbeauetlerenard');
    t = f.satinize(f.removeDiacritics(t), true);
    var key = "TROUVE";
    var c = core.encrypt.vigenere(t, key);
    console.log((t).split('').join(' '));
    console.log((Array(Math.round(t.length / key.length) + 1).join(key)).split('').join(' '));
    console.log((c).split('').join(' '));
    var l = 10000000;
    var theoryStr = "";
    for (var i = 0; i < t.length && i < l; i++) {
        var tChar = t[i]; // Lettre
        var cChar = c[i];

        var tCharCode = tChar.charCodeAt(0); // Code ascii
        var cCharCode = cChar.charCodeAt(0);

        var tAlphaIdx = tCharCode - constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX; // Index dans l'aphabet
        var cAlphaIdx = cCharCode - constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX;

        var idxKey = i % key.length;
        var KCharCode = key[idxKey].charCodeAt(0); // Clef
        var KAlphaIdx = KCharCode - constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX;

        var encryptionFormula = (tAlphaIdx + KAlphaIdx) % constants.NB_LETTERS_ALPHABET; //Formule utilisé pour crypter
        var letterEAlphaIdx = "E".charCodeAt(0) - constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX;

        var theoryFormula = (letterEAlphaIdx - cAlphaIdx) % constants.NB_LETTERS_ALPHABET; // Theorie : Trouver le texte initial à partir du crypté sans la clef
        theoryFormula = theoryFormula < 0 ? theoryFormula + constants.NB_LETTERS_ALPHABET : theoryFormula;

        var theoryChar = String.fromCharCode((theoryFormula + constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX));
        //console.log(tChar + "(" + key[idxKey] + ")" + cChar + " - " + tAlphaIdx + "(" + KAlphaIdx + ")" + cAlphaIdx + " - " + encryptionFormula + "?" + theoryFormula + "=>"+theoryChar);
        if (theoryFormula == tAlphaIdx) {
            theoryStr += theoryChar;
        } else {

            theoryFormula = (cAlphaIdx - letterEAlphaIdx) % constants.NB_LETTERS_ALPHABET; // Theorie : Trouver le texte initial à partir du crypté sans la clef
            theoryFormula = theoryFormula < 0 ? theoryFormula + constants.NB_LETTERS_ALPHABET : theoryFormula;

            theoryChar = String.fromCharCode((theoryFormula + constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX));
            if (theoryFormula == tAlphaIdx)
                theoryStr += theoryChar;
            else {
                theoryStr += "_";
            }
        }
    }
    console.log(theoryStr.split('').join(' '));
}


function secondTry() { //Longueur de la clef connu
    var t = f.satinize(f.removeDiacritics(textExamples.getContent('lecorbeauetlerenard')), true);
    var key = "KEY";
    var c = core.encrypt.vigenere(t, key);
    console.log("original : " + (t).spaceSeparate());
    console.log("clef     : " + (Array(Math.round(t.length / key.length) + 2).join(key)).spaceSeparate());
    console.log("crypté   : " + (c).spaceSeparate());
    var keyLength = key.length; //Let's suppose we know the key length
    var buffer = Array(t.length).join('_');
    for (var m = 0; m < keyLength; m++) {
        //First - We need to get char every keyLength character (after the m characters)
        var partStr = "";
        for (var i = m; i < c.length; i = i + keyLength) {
            partStr += c[i];
        }
        // As we know the key length, every character in partStr has been encrypted with the same letter of the key
        // Let's search for the most used character, It should be the encryption of E
        var ProbaLetters = {};
        for (i = 0; i < partStr.length; i++) {
            typeof ProbaLetters[partStr[i]] === "undefined" ? ProbaLetters[partStr[i]] = 1 : ProbaLetters[partStr[i]]++;
        }
        var mostUsedCharacter = "";
        var maxApparition = -1;
        for (var kPL in ProbaLetters) {
            if (maxApparition < ProbaLetters[kPL]) {
                mostUsedCharacter = kPL;
                maxApparition = ProbaLetters[kPL];
            }
        }
        // So the letter mostUsedCharacter is probably a E.
        //console.log(mostUsedCharacter + " => E");
        // Let's shift every character like a cesar cypher
        var decryptedFirstPartStr = "";
        var shiftDistance = mostUsedCharacter.charCodeAt(0) - "E".charCodeAt(0);
        var newChar;
        //console.log(shiftDistance);
        for (i = 0; i < partStr.length; i++) {
            var alphaIdx = partStr[i].charCodeAt(0) - constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX;
            var newAlphaIdx = (alphaIdx - shiftDistance) % constants.NB_LETTERS_ALPHABET;
            newAlphaIdx = newAlphaIdx < 0 ? newAlphaIdx + constants.NB_LETTERS_ALPHABET : newAlphaIdx;
            newChar = String.fromCharCode(newAlphaIdx + constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX);
            decryptedFirstPartStr += (newChar);
            buffer = buffer.replaceAt(m + i * keyLength, newChar);
        }
        //console.log(partStr.spaceSeparate());
        //console.log(decryptedFirstPartStr.spaceSeparate());
    }
    console.log("decrypté : " + buffer.spaceSeparate());
    console.log("Are the original and the decrypted equal ? buffer === t : " + (buffer === t));
}
console.time("onlykeylength");
console.log("Cryptage d'un message, et décryptage de celui-ci en ne connaissant que la longueur de la clef");
secondTry();
console.timeEnd("onlykeylength");