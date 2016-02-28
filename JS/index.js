'use strict';

var constants = require('./constants.js');
var core = require('./core.js');
var textExamples = require('./texts.js');
var f = require('./functions.js')();
var bigNumber = require('bignumber');
/*
 var t = textExamples.getContent('lecorbeauetlerenard');
 var key = "apdlo";
 var c = core.encrypt.vigenere(t, key);
 core.analyze.findKeyByXGrams(c);

//*/
var a = 11*11*7*13*17*529;
console.log(a);
console.log(f.findPrimeDivisors(a));
 //*/