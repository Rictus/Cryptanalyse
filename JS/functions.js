/**
 * Every uppercase char is transformed into lowercase char.
 * Remove every char that is not between a-z or 0-9.
 * @param str
 * @returns {string}
 */
function satinize(str) {
    str = str.toLowerCase();
    return str.replace(/[^a-z0-9]/gmi, '');
}
