/**
 * @desc
 * Module provide routes for Halls
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

var express = require('express');
var router = express.Router();
var controller = require('../services/halls.services.js');

// Get all halls
router.get('/halls', controller.getHalls);

module.exports = router;