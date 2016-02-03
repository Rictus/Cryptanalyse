'use strict';
var core = {
    process: function (text, onDone) {
        console.group("Texte : ");
        console.log("Length : " + text.length);
        //text = satinize(text);
        console.log("Satinized length : " + text.length);
        console.groupEnd();
        var freqC = core.getCharFrequency(text);
        var IC = core.getIndexOfCoincidence(freqC);
        onDone(freqC, IC);
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
        var strLen = str.length;
        var char_frequency = {};

        //from a to z
        for (var i = 97; i < 97 + 26; i++) {
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
    getIndexOfCoincidence: function (freqObj) {
        console.group("Index of coincidence");
        console.time("index_coincidence");
        var sum = 0;
        var nbTotalLetters = 0;
        for (var key in freqObj) {
            if (freqObj.hasOwnProperty(key)) {
                nbTotalLetters += freqObj[key].count;
            }
        }
        for (key in freqObj) {
            if (freqObj.hasOwnProperty(key) && freqObj[key].count >= 1) {
                sum += (freqObj[key].count * (freqObj[key].count - 1)) / (nbTotalLetters * (nbTotalLetters - 1));
            }
        }
        console.timeEnd("index_coincidence");
        console.groupEnd();
        return sum;
    },
    initVigenereCipher: function () {
        console.group("Vigenere Cipher");
        console.time("vigenere_ciphere");
        var ar = [];
        var col_char;
        var lin_char;
        var elem_char;
        for (var i = 0; i < 26; i++) {
            lin_char = String.fromCharCode(i + 65);
            ar[lin_char] = [];
            for (var j = 0; j < 26; j++) {
                col_char = String.fromCharCode(j + 65);
                var idx_alphabet_char = (i + j) % 26;
                elem_char = String.fromCharCode(65 + idx_alphabet_char);
                ar[lin_char][col_char] = elem_char + "_" + idx_alphabet_char;
            }
        }
        console.timeEnd("vigenere_ciphere");
        console.groupEnd();
    }
};