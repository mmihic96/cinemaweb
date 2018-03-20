/**
 * @desc
 * Module provide controllers for CRUD operations in bills.services module
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 26.01.2018
 * @license
 * None
 */

// Imported modules
var fs = require('fs');
var path = require('path');

// Constants
const PATH_TO_BILLS = path.join(__dirname, '..', 'data', 'bills.json');
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
 * Read bills from file
 * @param {String} path
 * @return {Array} Array of bills 
 */
function readBills() {
    if (pathExist(PATH_TO_BILLS)) {
        return fs.readFileSync(PATH_TO_BILLS, ENCODING);
    } else {
        return JSON.stringify([]);
    }
}

/**
 * Get all bills from file
 * @return {Array} Array of bills
 */
function getAllBills() {
    return JSON.parse(readBills());
}

/**
 * Add new bill to file
 * @param {Object} data
 * @return {Integer} ID of new bill
 */
function addNewBill(data) {
    let newID = null;
    let allBills = getAllBills();
    if (allBills.length > 0) {
        let newID = allBills[allBills.length - 1].id + 1;
        data['id'] = newID;
    } else {
        newID = 1;
        data['id'] = newID;
    }
    allBills.push(data);
    fs.writeFileSync(PATH_TO_BILLS, JSON.stringify(allBills, null, 2), 'utf8');
    return newID;
}

exports.getAllBills = getAllBills;
exports.addNewBill = addNewBill;