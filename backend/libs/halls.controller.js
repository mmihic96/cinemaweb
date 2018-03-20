/**
 * @desc
 * Module provide controllers for CRUD operations in halls.services module
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 26.01.2018
 * @license
 * None
 */

// Imported modules
var fs = require('fs');
var path = require('path');

// Constants
const PATH_TO_HALLS = path.join(__dirname, '..', 'data', 'halls.json');
const ENCODING = 'UTF8';

/**
 * Check if path exist.
 * @param {String} path Path
 * @return {Boolean} True || False
 */
function pathExist(path) {
    return fs.existsSync(path);
}

/**
 * Read halls from file
 * @param {String} path
 * @return {Array} Array of halls 
 */
function readHalls() {
    if (pathExist(PATH_TO_HALLS)) {
        return fs.readFileSync(PATH_TO_HALLS, ENCODING);
    } else {
        return JSON.stringify([]);
    }
}

/**
 * Function read all halls from file
 * @return {Array} array of halls
 */
function getAllHalls() {
    return JSON.parse(readHalls());
}

exports.getAllHalls = getAllHalls;