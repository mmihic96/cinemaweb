/**
 * @desc
 * Module provide CRUD operations for users
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

// Imported modules
var lib = require('../libs/users.controller');

/**
 * Create new user
 * @param {Object} req Request example - POST: /api/user
 * @param {Object} res Response example - {
 *                                          "newUserID": 1234
 *                                        }
 */
function addNewUser(req, res) {
    var newUserInfo = req.body;
    var newID = lib.addNewUser(newUserInfo);
    res.status(200).send({ newUserID: newID });
}

/**
 * Get all users
 * @param {Object} req Request example - GET: /api/users
 * @param {Object} res Response example - [
 *                                          {
 *                                              "id": 1,              - Integer
 *                                              "fname": First_Name,  - String
 *                                              "lname": "Last_Name", - String
 *                                              "username": Username, - String
 *                                              "password": Password, - String
 *                                              "role": Role          - String
 *                                          }
 *                                        ]
 */
function getUsers(req, res) {
    var users = lib.getUsers();
    res.status(200).end(users);
}

/**
 * Get expected user
 * @param {Object} req Request example - GET: /api/user/123 
 * @param {Object} res Response example - {
 *                                           "id": 1,              - Integer
 *                                           "fname": First_Name,  - String
 *                                           "lname": "Last_Name", - String
 *                                           "username": Username, - String
 *                                           "password": Password, - String
 *                                           "role": Role          - String
 *                                         }
 */
function getUser(req, res) {
    var userID = req.params.id;
    var user = lib.findUserByID(userID);
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).end();
    }

}

/**
 * Update user information
 * @param {Object} req Request example - PUT: /api/user/123
 * @param {Object} res Response status code 200 (OK) || 404 (Not found)
 */
function updateUser(req, res) {
    var userInfo = req.body;
    var updated = lib.updateUser(userInfo);
    if (updated) {
        res.status(200).end();
    } else {
        res.status(400).end();
    }

}

/**
 * Delete user
 * @param {Object} req Request example - DELETE: /api/user/123
 * @param {Object} res Response status code 200 (OK) || 404 (Not found)
 */
function deleteUser(req, res) {
    var userID = req.params.id;
    var deleted = lib.deleteUser(userID);
    if (deleted) {
        res.status(200).end();
    } else {
        res.status(404).end();
    }

}

function uploadImage(req, res) {
    if (req.files == null) {
        res.status(400).send({ message: 'No image to upload.' });
    } else {
        let sampleFile = req.files.sampleFile;
        lib.uploadImage(sampleFile, function (err, imageName) {
            if (!err) {
                res.status(200).send({ message: "Image uploaded.", name: imageName });
            } else {
                res.status(500).send({ message: "Error while uploading image." })
            }
        });
    }


}
function validateUser(req, res) {
    var validateUser = req.body;
    var user = lib.validateUser(validateUser);
    if (user) {
        res.status(200).send(user);
    } else {
        res.status(404).send({ message: "Not valid user!" })
    }
}

function getUserAvatar(req, res) {
    var imageName = req.params.name;
    var image = lib.getUserAvatar(imageName);
    if (image) {
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.end(image, 'binary');
    } else {
        res.end(null);
    }
}

// Exported functions
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.addNewUser = addNewUser;
exports.updateUser = updateUser;
exports.uploadImage = uploadImage;
exports.validateUser = validateUser;
exports.getUserAvatar = getUserAvatar;