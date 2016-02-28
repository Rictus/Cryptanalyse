'use strict';


var constants = require('./constants.js');
var core = require('./core.js');
var textExamples = require('./texts.js');
var f = require('./functions.js')();


var key = "exampleKey";
var text = f.satinize(f.removeDiacritics(textExamples.matiereNoire), true);
var crypted = core.encrypt.vigenere(text, key);

console.log(text);
console.log("\n" + crypted);