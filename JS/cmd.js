'use strict';

var core = require('./core.js');
var textExamples = require('./texts.js');
var f = require('./functions.js')();
var fs = require('fs');

var possibleOptions = ["-e", "-d", "-a", "-fi", "-si", "-ti", "-fo", "-k"];
var args = process.argv;
args.shift(); //node executable
args.shift(); //file path

var action = false;
var fileOut = false;
var fileIn = false;
var strIn = false;
var key = false;

var help = function () {
    console.log("Usage : ");
    console.log("-e|-d|-a   -fi|-si|-ti path|string   [-fo outputpath] -k keystring");
    console.log("-e : Encrypt the input stream with the given key");
    console.log("-d : Decrypt the input stream with the given key");
    console.log("-a : Analyze the input stream to find the key length and try to decrypt it.");

    console.log("-fi -si -ti specify input stream");
    console.log("-fi for a file, next argument should be a path");
    console.log("-si for a string, next argument is the string");
    console.log("-ti for one of programs texts. See TEXT Directory, next argument should be the name of the file without extension.");
    console.log("-fo redirect the output in a file");
    console.log("if -fo is not specified, the result of the command is display.");
};


var checkAction = function () {
    if (args.indexOf('-e') >= 0) {
        action = "encrypt";
    }
    else if (args.indexOf('-d') >= 0) {
        action = "decrypt";
    }
    else if (args.indexOf('-a') >= 0) {
        action = "analyze";
    } else {
        help();
    }
};

var checkInputStream = function () {
    var indexFI = args.indexOf("-fi");
    var indexSI = args.indexOf("-si");
    var indexTI = args.indexOf("-ti");
    if (indexFI >= 0 && indexFI + 1 < args.length && possibleOptions.indexOf(args[indexFI + 1]) == -1) {
        fileIn = args[indexFI + 1];
    }
    else if (indexSI >= 0 && indexSI + 1 < args.length && possibleOptions.indexOf(args[indexSI + 1]) == -1) {
        strIn = args[indexSI + 1];
        var i = indexSI + 2;
        while (i < args.length && possibleOptions.indexOf(args[i]) == -1) {
            strIn += " " + args[i];
            args.splice(i, 1);
        }
    }
    else if (indexTI >= 0 && indexTI + 1 < args.length && possibleOptions.indexOf(args[indexTI + 1]) == -1) {
        fileIn = textExamples.filePaths[args[indexTI + 1]];
        if (!fileIn) {
            fileIn = false;
            console.log("-t value : Unknown input file : " + args[indexTI + 1]);
        }
    }
    else {
        console.log("Error, No input stream.");
        help();
    }

    if (fileIn) {
        try {
            fs.accessSync(fileIn, fs.F_OK | fs.R_OK);
            strIn = fs.readFileSync(fileIn, {encoding: "utf8"});

        } catch (Exception) {
            console.log("input stream : Can't access to the given input file : " + fileIn);
        }
    }
};

var checkOutputStream = function () {
    var indexFO = args.indexOf("-fo");
    if (indexFO >= 0) {
        if (indexFO + 1 < args.length && possibleOptions.indexOf(args[indexFO + 1]) == -1) {
            fileOut = args[indexFO + 1];
        } else {
            console.log("-fo option specified but no value given.");
            fileOut = false;
        }
    }
    if (fileOut) {
        try {
            //fs.accessSync(fileIn, fs.F_OK | fs.R_OK | fs.W_OK);
        } catch (Exception) {
            console.log("-t value : Can't access to the given output file : " + fileOut);
        }
    }
};

var checkKey = function () {
    var indexK = args.indexOf("-k");
    var indexA = args.indexOf("-a"); //Key is not required when -a is specified
    if (indexA == -1) {
        if (indexK >= 0 && indexK + 1 < args.length) {
            key = args[indexK + 1];
        } else {
            console.log("No key given. Complete or Use -k option.")
        }
    }
};

checkAction();
checkInputStream();
checkOutputStream();
checkKey();

if (action && strIn && key) {
    strIn = f.removeDiacritics(f.satinize(strIn));
    var data = core[action]['vigenere'](strIn, key);
    if (fileOut) {
        fs.writeFile(fileOut, data, fs.O_WRONLY | fs.O_CREAT | fs.O_TRUNC, function (err) {
            if (err) {
                throw err;
            }
            console.log("Find output to : " + fileOut);
        });
    } else {
        console.log(data);
    }
}