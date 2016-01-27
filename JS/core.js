'use strict';
var core = {
    process: function (text, onDone) {
        console.group();
        console.log(text.length);
        text = satinize(text);
        console.log(text.length);
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

        return char_frequency;
    },
    getIndexOfCoincidence: function (freqObj) {
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
        return sum;
    }
};