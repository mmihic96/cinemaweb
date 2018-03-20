/**
 * @desc
 * Module provide controllers for CRUD operations in auth.services module
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 26.01.2018
 * @license
 * None
 */

// Imported modules
var fs = require('fs');
var path = require('path');
var moment = require('moment');
// Constants
const PATH_TO_USERS = path.join(__dirname, '..', 'data', 'users.json');
const PATH_TO_LOGINS = path.join(__dirname, '..', 'data', 'logins.json');
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
 * Read users from file
 * @param {String} path
 * @return {Array} Array of users 
 */
function readusers() {
    if (pathExist(PATH_TO_USERS)) {
        return fs.readFileSync(PATH_TO_USERS, ENCODING);
    } else {
        return JSON.stringify([]);
    }
}

/**
 * Get all users from file
 * @return {Array} Array of users
 */
function getAllUsers() {
    return JSON.parse(readusers());
}

function authenticateUser(username, password) {
    let users = getAllUsers();
    for (let i = 0; i < users.length; i++) {
        if (username === users[i].username && password === users[i].password) {
            return users[i];
        }
    }
}

function logInformation(username, password, role = null, success = false) {
    let dateAndTime = moment().format('MMMM Do YYYY, h:mm:ss a');;
    var loginInfo = {
        "dateAndTime": dateAndTime,
        "username": username,
        "password": password,
        "role": role,
        "success": success
    }
    let logins = JSON.parse(fs.readFileSync(PATH_TO_LOGINS, 'utf8'));
    logins.push(loginInfo);
    fs.writeFileSync(PATH_TO_LOGINS, JSON.stringify(logins, null, 2), 'utf8');
}

exports.authenticateUser = authenticateUser;
exports.logInformation = logInformation;