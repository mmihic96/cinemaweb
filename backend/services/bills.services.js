/**
 * @desc
 * Module provide CRUD operations for bills
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

// Imported modules
var lib = require('../libs/bills.controller.js');

function getBills(req, res) {
    let bills = lib.getAllBills();
    res.status(200).send(bills);
}

function addNewBill(req, res) {
    let bill = req.body;
    let newID = lib.addNewBill(bill);
    res.status(200).send({ newID: newID });

}
exports.getBills = getBills;
exports.addNewBill = addNewBill;