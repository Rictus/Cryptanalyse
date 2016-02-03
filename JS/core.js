'use strict';

var indexOfCoincidence = [
    ['Russe', 0.0529],
    ['Serbe', 0.0643],
    ['Suedois', 0.0644],
    ['Anglais', 0.0667],
    ['Esperanto', 0.0690],
    ['Grec', 0.0691],
    ['Norvégien', 0.0694],
    ['Danois', 0.0707],
    ['Finnois', 0.0737],
    ['Italien', 0.0738],
    ['Portugais', 0.0745],
    ['Arabe', 0.0758],
    ['Allemand', 0.0762],
    ['Hebreu', 0.0768],
    ['Espagnol', 0.0770],
    ['Japonais', 0.0772],
    ['Français', 0.0778],
    ['Neerlandais', 0.0798],
    ['Malaysien', 0.0852]
];
var NB_LETTERS_ALPHABET = 26;
var FIRST_LETTER_UPPERCASE_ASCII_INDEX = 65;
var LAST_LETTER_UPPERCASE_ASCII_INDEX = 65 + NB_LETTERS_ALPHABET - 1;
var core = {
    process: function (text, onDone) {
        console.group("Texte : ");
        console.log("Length : " + text.length);
        var satinizedText = satinize(text);
        console.log("Satinized length : " + satinizedText.length);
        console.groupEnd();
        var freqC = core.analyze.getCharFrequency(satinizedText);
        var IC = core.analyze.getIndexOfCoincidence(freqC);
        var vigenereEncrypted = core.encrypt.vigenere(text);
        var vigenereDecrypted = core.decrypt.vigenere(vigenereEncrypted, "MUSIQUE");
        onDone(freqC, IC);
    },
    encrypt: {
        vigenere: function (str, key) {
            console.group("Vigenere encryption");
            console.time("vigenere_encryption");
            if (typeof key === "undefined" || key.length == 0) {
                key = "MUSIQUE";
            }
            str = removeDiacritics(str.toUpperCase());

            var keyCharAlphabetIdx;
            var originalCharAlphabetIdx;
            var cryptedCharAlphabetIdx;
            var keyIdx = 0;
            var cryptedStr = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) >= FIRST_LETTER_UPPERCASE_ASCII_INDEX && str.charCodeAt(i) <= LAST_LETTER_UPPERCASE_ASCII_INDEX) {
                    keyCharAlphabetIdx = key[keyIdx].charCodeAt(0) - FIRST_LETTER_UPPERCASE_ASCII_INDEX;
                    originalCharAlphabetIdx = str[i].charCodeAt(0) - FIRST_LETTER_UPPERCASE_ASCII_INDEX;
                    cryptedCharAlphabetIdx = (originalCharAlphabetIdx + keyCharAlphabetIdx) % NB_LETTERS_ALPHABET;
                    cryptedStr += String.fromCharCode(cryptedCharAlphabetIdx + FIRST_LETTER_UPPERCASE_ASCII_INDEX);

                    keyIdx = (keyIdx + 1) % key.length;
                } else {
                    cryptedStr += str[i];
                }
            }
            console.log(str);
            console.log(cryptedStr);
            console.timeEnd("vigenere_encryption");
            console.groupEnd();
            return cryptedStr;
        }
    },
    decrypt: {
        vigenere: function (cryptedStr, key) {
            console.group("Vigenere decryption");
            console.time("vigenere_decryption");
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
                cryptedAlphabetIdx = cryptedCharCode - FIRST_LETTER_UPPERCASE_ASCII_INDEX;
                if (cryptedAlphabetIdx >= 0 && cryptedAlphabetIdx <= NB_LETTERS_ALPHABET - 1) {
                    keyAlphabetIdx = key.charCodeAt(keyIdx) - FIRST_LETTER_UPPERCASE_ASCII_INDEX;
                    originalCharCode = (cryptedAlphabetIdx - keyAlphabetIdx) % NB_LETTERS_ALPHABET;
                    originalCharCode = originalCharCode < 0 ? originalCharCode + NB_LETTERS_ALPHABET : originalCharCode;
                    originalChar = String.fromCharCode(originalCharCode + FIRST_LETTER_UPPERCASE_ASCII_INDEX);

                    decryptedStr += originalChar;
                    keyIdx = (keyIdx + 1) % key.length;
                } else {
                    decryptedStr += cryptedChar;
                }
            }
            console.log(cryptedStr);
            console.log(decryptedStr);
            console.timeEnd("vigenere_decryption");
            console.groupEnd();
            return decryptedStr;
        }
    },
    analyze: {
        getVigenereCipherArray: function () {//USeless
            console.group("Vigenere Cipher");
            console.time("vigenere_ciphere");
            var ar = [];
            var col_char;
            var lin_char;
            var elem_char;
            for (var i = 0; i < NB_LETTERS_ALPHABET; i++) {
                lin_char = String.fromCharCode(i + FIRST_LETTER_UPPERCASE_ASCII_INDEX);
                ar[lin_char] = [];
                for (var j = 0; j < NB_LETTERS_ALPHABET; j++) {
                    col_char = String.fromCharCode(j + FIRST_LETTER_UPPERCASE_ASCII_INDEX);
                    var idx_alphabet_char = (i + j) % NB_LETTERS_ALPHABET;
                    elem_char = String.fromCharCode(FIRST_LETTER_UPPERCASE_ASCII_INDEX + idx_alphabet_char);
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
            console.group("Char frequency");
            console.time("char_frequency");
            str = str.toUpperCase();
            var strLen = str.length;
            var char_frequency = {};

            //from a to z
            for (var i = FIRST_LETTER_UPPERCASE_ASCII_INDEX; i < LAST_LETTER_UPPERCASE_ASCII_INDEX; i++) {
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
            console.timeEnd("char_frequency");
            console.groupEnd();
            return char_frequency;
        },
        getIndexOfCoincidence: function (input) {
            console.group("Index of coincidence");
            console.time("index_coincidence");
            var curIdxOfCoincidence = 0;
            var nbTotalLetters = 0;

            var distance = Number.MAX_VALUE;
            var closestIdxOfCoincidence;

            if (typeof input === "object") {
                console.log(input);
                var freqObj = input;
            } else if (typeof input === "string") {
                var char_frequency = [];
                //from a to z
                for (var i = FIRST_LETTER_UPPERCASE_ASCII_INDEX; i < LAST_LETTER_UPPERCASE_ASCII_INDEX; i++) {
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

            //TODO Ne faire que les lettres qui apparaissent ds le txt
            console.group("debug");
            console.log(curIdxOfCoincidence);
            for (key in freqObj) {
                console.log(input);
                if (freqObj.hasOwnProperty(key) && freqObj[key].count >= 1) {
                    console.log((freqObj[key].count * (freqObj[key].count - 1)));
                    curIdxOfCoincidence += (freqObj[key].count * (freqObj[key].count - 1)) / (nbTotalLetters * (nbTotalLetters - 1));
                }
            }
            console.log(curIdxOfCoincidence);
            console.groupEnd();
            console.log(freqObj);
            for (i = 0; i < indexOfCoincidence.length; i++) {
                var curDist = Math.abs(indexOfCoincidence[i][1] - curIdxOfCoincidence);
                if (curDist < distance) {
                    closestIdxOfCoincidence = i;
                    distance = curDist;
                }
            }

            console.timeEnd("index_coincidence");
            console.groupEnd();
            return [indexOfCoincidence[closestIdxOfCoincidence][0], curIdxOfCoincidence];
        },
        vigenere: function (cryptedText) {
            var charF = this.getCharFrequency(cryptedText);
            cryptedText = satinize(cryptedText, true);

            console.group("Vigenere Analyze");
            console.time("vigenere_analyze");
            for (var nbLet = 1; nbLet < 10; nbLet++) {
                var pattern = "([a-zA-Z0-9]{1," + nbLet + "})";
                var regex = new RegExp(pattern, "g");
                var matches = cryptedText.match(regex);
                //calculate IC for each matches
                for (var matchIdx = 0; matchIdx < matches.length; matchIdx++) {
                    console.log(this.getIndexOfCoincidence(matches[matchIdx]));
                }
            }
            console.timeEnd("vigenere_analyze");
            console.groupEnd();

        }
    }
};