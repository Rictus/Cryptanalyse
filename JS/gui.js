'use strict';
var submitButton$;
var charFrequency$;
var inputText$;
var idxCoincidence$;
var encryptionResult$;
var decryptionResult$;
var gui = {
    init: function () {
        submitButton$ = document.getElementById('submit');
        inputText$ = document.getElementById('textInput');
        charFrequency$ = document.getElementById('baseCharFrequency');
        idxCoincidence$ = document.getElementById('baseIdxCoincidence');
        encryptionResult$ = document.getElementById('encryptionResult');
        decryptionResult$ = document.getElementById('decryptionResult');
    },
    launchEncryptionDecryption: function (algo) {
        //console.clear();
        charFrequency$.innerHTML = "";
        idxCoincidence$.innerHTML = "";
        encryptionResult$.innerHTML = "";
        decryptionResult$.innerHTML = "";
        switch (algo) {
            case 'vigenere':
                var key = "MUSIQUJTYHRTGERFERTUYTIUYYRTE";
                var originalText = inputText$.value;
                var cryptedText = core.encrypt.vigenere(originalText, key);
                var foundedKey = core.analyze.vigenere(cryptedText);
                gui.appendCharFrequencyArray(foundedKey, charFrequency$);
                var decryptedText = core.decrypt.vigenere(cryptedText, key);
                encryptionResult$.innerHTML = "<th>Cryptage</th><td>" + originalText + "</td><td>" + cryptedText + "</td>";
                decryptionResult$.innerHTML = "<th>Decryptage</th><td>" + cryptedText + "</td><td>" + decryptedText + "</div>";
                break;
            case 'analyze':
                core.process(inputText$.value, gui.appendData);
                break;
            default:
                console.warn("Uknown algorithm : " + algo);
                break;
        }
    },
    appendData: function (freqCountObj, idxCoincidence) {
        gui.appendCharFrequencyArray(freqCountObj, charFrequency$);
        gui.appendIndexCoincidence(idxCoincidence);
    },
    appendCharFrequencyArray: function (freqObj, element) {
        var html = "<table>";
        var head = "<tr><th></th>";
        var data_l1 = "<tr><th>Frequency</th>";
        var data_l2 = "<tr><th>Count</th>";
        var ar = [];
        for (var key in freqObj) {
            ar.push([key, freqObj[key]]);
        }
        ar.sort(function (a, b) {
            if (a[1].frequency > b[1].frequency) {
                return -1;
            } else if (a[1].frequency < b[1].frequency) {
                return 1;
            }
            return 0;
        });
        for (var i = 0; i < ar.length; i++) {
            head += "<th>" + ar[i][0] + "</th>";
            data_l1 += "<td>" + ar[i][1].frequency.toFixed(2) + "</td>";
            data_l2 += "<td>" + ar[i][1].count + "</td>";
        }
        data_l1 += "</tr>";
        data_l2 += "</tr>";
        head += "</tr>";
        html += head + data_l1 + data_l2 + "</table>";
        element.innerHTML = html;
    },
    appendIndexCoincidence: function (indexOfCoincidence) {
        idxCoincidence$.innerHTML = "Indice de coincidence : " + indexOfCoincidence[1] + "   (  " + indexOfCoincidence[0] + " )";
    }
};