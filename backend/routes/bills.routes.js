/**
 * @desc
 * Module provide routes for bills
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

var express = require('express');
var router = express.Router();
var controller = require('../services/bills.services.js');

// Get all bills
router.get('/bills', controller.getBills);
// Add new bill
router.post('/bill', controller.addNewBill);

module.exports = router;