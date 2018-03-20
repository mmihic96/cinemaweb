/**
 * @desc
 * Module provide CRUD operations for halls
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

// Imported modules
var lib = require('../libs/halls.controller.js');

function getHalls(req, res) {
    let halls = lib.getAllHalls();
    res.status(200).send(halls);
}

exports.getHalls = getHalls;