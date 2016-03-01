'use strict';

var constants = require('./constants.js');
var core = require('./core.js');
var textExamples = require('./texts.js');
var f = require('./functions.js')();
var bigNumber = require('bignumber');

var t = textExamples.getContent('lecorbeauetlerenard');
t = f.satinize(f.removeDiacritics(t), true);
var key = "TROUVE";
var c = core.encrypt.vigenere(t, key);
console.log((t).split('').join(' '));
console.log((key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key+key).split('').join(' '));
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

    var theoryFormula = (cAlphaIdx - letterEAlphaIdx); // Theorie : Trouver le texte initial à partir du crypté sans la clef
    theoryFormula = theoryFormula < 0 ? theoryFormula + constants.NB_LETTERS_ALPHABET : theoryFormula;

    var theoryChar = String.fromCharCode((theoryFormula + constants.FIRST_LETTER_UPPERCASE_ASCII_INDEX));
    if (theoryFormula == tAlphaIdx)
        theoryStr += theoryChar;
    //console.log(tChar + "(" + key[idxKey] + ")" + cChar + " - " + tAlphaIdx + "(" + KAlphaIdx + ")" + cAlphaIdx + " - " + encryptionFormula + "?" + theoryFormula + "=>"+theoryChar);
    else
        theoryStr += "_";
}

console.log(theoryStr.split('').join(' '));