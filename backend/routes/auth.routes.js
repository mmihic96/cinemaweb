/**
 * @desc
 * Module provide routes for Authentification
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

var express = require('express');
var router = express.Router();
var controller = require('../services/auth.services.js');

// Authenticate User
router.post('/login', controller.authenticateUser);
router.post('/logout', controller.logout);
module.exports = router;