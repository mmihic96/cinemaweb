/**
 * @desc
 * Module provide req, res for auth
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

// Imported modules
var lib = require('../libs/auth.controller.js');
const MAX_AGE = 120000000000;

function authenticateUser(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    try {
        var auth = lib.authenticateUser(username, password);
        if (auth) {
            lib.logInformation(auth.username, auth.password, auth.role, true);
            if (auth.role === 'seller') {
                res.cookie('seller', JSON.stringify(auth), { maxAge: MAX_AGE });
            } else if (auth.role === 'manager') {
                res.cookie('manager', JSON.stringify(auth), { maxAge: MAX_AGE });
            }
            res.status(200).end(JSON.stringify(auth));
        } else {
            lib.logInformation(username, password);
            res.status(401).end();
        }

    } catch (error) {
        var response = {
            login: "ERR",
            err: "You are not allowed to access the application"
        };
        res.status(401).end(JSON.stringify(response));
    }

}

function logout(req, res) {
    var cookie = req.cookies;
    res.clearCookie(Object.keys(cookie)[0]).end();
}

exports.authenticateUser = authenticateUser;
exports.logout = logout;