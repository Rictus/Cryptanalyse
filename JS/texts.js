var fs = require('fs');


var matiereNoire = "La matière noire ou matière sombre (traduction de l'anglais dark matter), parfois aussi nommée de façon plus réaliste matière transparente, désigne une catégorie de matière hypothétique, invoquée pour rendre compte d'observations astrophysiques, notamment les estimations de masse des galaxies et des amas de galaxies et les propriétés des fluctuations du fond diffus cosmologique." +
    "Différentes hypothèses sont explorées sur la composition de la matière noire : gaz moléculaire, étoiles mortes, naines brunes en grand nombre, trous noirs, etc. Cependant, les estimations de la densité de l'Univers et du nombre d'atomes impliquent une nature non baryonique. Des astrophysiciens supposent d'autres particules, peut-être des superpartenaires tels que le neutralino, regroupées sous le nom générique de WIMP." +
    "La matière noire aurait pourtant une abondance au moins cinq fois plus importante que la matière baryonique, pour constituer environ 27 % de la densité d'énergie totale de l'Univers observable4, selon les modèles de formation et d'évolution des galaxies, ainsi que les modèles cosmologiques.";
var Wikipedia_Crypted_Example_Fr = "KQOWEFVJPUJUUNUKGLMEKJINMWUXFQMKJBGWRLFNFGHUDWUUMBSVLPSNCMUEKQCTESWREEKOYSSIWCTUAXYOTAPXPLWPNTCGOJBGFQHTDWXIZAYGFFNSXCSEYNCTSSPNTUJNYTGGWZGRWUUNEJUUQEAPYMEKQHUIDUXFPGUYTSMTFFSHNUOCZGMRUWEYTRGKMEEDCTVRECFBDJQCUSWVBPNLGOYLSKMTEFVJJTWWMFMWPNMEMTMHRSPXFSSKFFSTNUOCZGMDOEOYEEKCPJRGPMURSKHFRSEIUEVGOYCWXIZAYGOSAANYDOEOYJLWUNHAMEBFELXYVLWNOJNSIOFRWUCCESWKVIDGMUCGOCRUWGNMAAFFVNSIUDEKQHCEUCPFCMPVSUDGAVEMNYMAMVLFMAOYFNTQCUAFVFJNXKLNEIWCWODCCULWRIFTWGMUSWOVMATNYBUHTCOCWFYTNMGYTQMKBBNLGFBTWOJFTWGNTEJKNEEDCLDHWTYYIDGMVRDGMPLSWGJLAGOEEKJOFEKUYTAANYTDWIYBNLNYNPWEBFNLFYNAJEBFR";

exports.matiereNoire = matiereNoire;
exports.Wikipedia_Example_Fr = Wikipedia_Crypted_Example_Fr;

var filePaths = {
    "lecorbeauetlerenard": "./TEXT/LeCorbeauEtLeRenard.txt",
    "enex": "./TEXT/English.txt",
    "hameletfr": "./TEXT/Hamlet_Fr.txt",
    "assomoir": "./TEXT/Lassomoir.txt"
};

exports.getContent = function (key) {
    if (typeof filePaths[key] === "string") {
        var filepath = "." + filePaths[key];
        try {
            fs.accessSync(filepath, fs.F_OK | fs.R_OK);
            return fs.readFileSync(filepath, {encoding: "utf8"});
        } catch (Exception) {
            throw Exception; //TODO Error handling
        }
    } else {
        return false;
    }
};
exports.filePaths = filePaths;