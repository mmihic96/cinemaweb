/**
 * @desc
 * Module provide controllers for CRUD operations in userService module
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

// Imported modules
var fs = require('fs');
var path = require('path');

// Constants
const PATH_TO_USERS = path.join(__dirname, '..', 'data', 'users.json');
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
 * @return {Array} Array of users 
 */
function readUsers() {
    if (pathExist(PATH_TO_USERS)) {
        return fs.readFileSync(PATH_TO_USERS, ENCODING);
    } else {
        return JSON.stringify([]);
    }

}

/**
 * Write usert to user.json file
 * @param {Array} users Array of users
 */
function writeUsers(users) {
    fs.writeFileSync(PATH_TO_USERS, JSON.stringify(users, null, 2));
}

/**
 * Add new user in file (users.json).
 * @param {Object} userInfo Infromation about new user.
 * @return {String} ID of new user. Exampe: id_1234
 */
function addNewUser(userInfo) {
    var users = JSON.parse(readUsers());
    var newID = null;
    if (users.length == 0) {
        newID = 1;
    } else {
        newID = users[users.length - 1].id + 1;
    }
    var newUser = userInfo;
    newUser['id'] = newID;
    users.push(newUser);
    writeUsers(users);
    return "id_" + newID;
}

/**
 * Read users from file (users.json).
 * @return {Array} Array of users object. If path does not exist return empty array.
 */
function getUsers() {
    var users = readUsers();
    return users;
}

/**
 * Find user by user ID
 * @param {Integer} userID
 * @return {Object} User information || null
 */
function findUserByID(userID) {
    var users = JSON.parse(getUsers());
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == userID) {
            return JSON.stringify(users[i]);
        }
    }
    return null;
}

/**
 * Find user by username
 * @param {String} username
 * @return {Object} User information || null 
 */
function findUserByUsername(username) {
    var users = JSON.parse(getUsers());
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            return JSON.stringify(users[i]);
        }
    }
    return null;
}

/**
 * Update user information
 * @param {Object} userInfo 
 * @return {Boolean} True || False depends if user exist
 */
function updateUser(userInfo) {
    var users = JSON.parse(getUsers());
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == userInfo.username) {
            users[i].fname = userInfo.fname;
            users[i].lname = userInfo.lname;
            users[i].password = userInfo.password;
            users[i].role = userInfo.role;
            if (userInfo.avatar) {
                users[i].avatar = userInfo.avatar;
            }
            writeUsers(users);
            return true;
        }
    }
    return false;
}

/**
 * Delete user
 * @param {Integer} userID 
 * @return {Boolean} True || False
 */
function deleteUser(userID) {
    try {
        var id = userID;
        var users = JSON.parse(readUsers());
        for (let i = 0; i < users.length; i++) {
            if (users[i]['id'] == id) {
                users.splice(i, 1);
                writeUsers(users);
                return true;
            }
        }
        return false;

    } catch (err) {
        return false;
    }
}

/**
 * Movie given file to another location
 * @param {File} sampleFile File
 * @param {Function} cb callback function
 */
function uploadImage(sampleFile, cb) {
    let location = path.join(__dirname, '..', 'uploads', sampleFile.name);
    sampleFile.mv(location, function (err) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, sampleFile.name);
    });
}

/**
 * Validate user
 * @param {Object} user
 * @return {Object} if user exist and its valid password return user otherwise return null 
 */
function validateUser(user) {
    let users = JSON.parse(getUsers());
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === user.username && users[i].password === user.password) {
            return users[i];
        }
    }
    return null;
}

function getUserAvatar(imageName) {
    var pathToImage = path.join(__dirname, '..', 'uploads', imageName);
    if (pathExist(pathToImage)) {
        return fs.readFileSync(pathToImage);
    }
    return null;
}
// Exported function
exports.getUsers = getUsers;
exports.findUserByID = findUserByID;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.addNewUser = addNewUser;
exports.uploadImage = uploadImage;
exports.validateUser = validateUser;
exports.getUserAvatar = getUserAvatar;