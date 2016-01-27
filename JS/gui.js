'use strict';
var submitButton;
var baseCharFrequency;
var inputTextElement;
var baseIdxCoincidence;
var gui = {
    init: function () {
        submitButton = document.getElementById('submit');
        inputTextElement = document.getElementById('textInput');
        baseCharFrequency = document.getElementById('baseCharFrequency');
        baseIdxCoincidence = document.getElementById('baseIdxCoincidence');


        submitButton.addEventListener('click', function () {
            core.process(inputTextElement.value, gui.appendData);
        });
    },
    appendData: function (freqCountObj, idxCoincidence) {
        gui.appendCharFrequencyArray(freqCountObj);
        gui.appendIndexCoincidence(idxCoincidence);

    },
    appendCharFrequencyArray: function (freqObj) {
        var html = "<table>";
        var head = "<tr><th></th>";
        var data_l1 = "<tr><th>Frequency</th>";
        var data_l2 = "<tr><th>Count</th>";
        for (var key in freqObj) {
            if (freqObj.hasOwnProperty(key)) {
                head += "<th>" + key + "</th>";
                data_l1 += "<td>" + freqObj[key].frequency.toFixed(2) + "</td>";
                data_l2 += "<td>" + freqObj[key].count + "</td>";
            }
        }
        data_l1 += "</tr>";
        data_l2 += "</tr>";
        head += "</tr>";
        html += head + data_l1 + data_l2 + "</table>";
        baseCharFrequency.innerHTML = html;
    },
    appendIndexCoincidence: function (indexOfCoincidence) {
        baseIdxCoincidence.innerHTML = "Indice de coincidence : " + indexOfCoincidence;
    }
};