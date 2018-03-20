/**
 * @desc
 * Module provide routes for Create user, Retrive user/s, Update user and Delete user
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

var express = require('express');
var router = express.Router();
var controller = require('../services/users.services.js');

// Add new User
router.post('/user', controller.addNewUser);
// Get all users
router.get('/users', controller.getUsers);
// Get expected user
router.get('/user/:id', controller.getUser);
// validateUser
router.post('/user/validate', controller.validateUser);
// Edit user
router.put('/user/:id', controller.updateUser);
// Delete user
router.delete('/user/:id', controller.deleteUser);
// Upload image
router.post('/user/upload', controller.uploadImage);
// Get image
router.get('/user/image/:name', controller.getUserAvatar);

module.exports = router;