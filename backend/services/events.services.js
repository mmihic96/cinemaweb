/**
 * @desc
 * Module provide CRUD operations for events
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

// Imported modules
var lib = require('../libs/events.controller.js');


function addNewEvent(req, res) {
    let event = req.body;
    let newID = lib.addNewEvent(event);
    if (newID) {
        res.status(200).send({ newEventID: newID });
    } else {
        res.status(404).send({ message: "Time conflict!" });
    }

}

function getEvents(req, res) {
    let events = lib.getAllEvents();
    res.status(200).send(events);
}

function getEvent(req, res) {
    let eventID = req.params.id;
    let event = lib.findEvent(eventID);
    if (event) {
        res.status(200).send(event);
    } else {
        res.status(404).end();
    }
}

function updateEvent(req, res) {
    let eventINFO = req.body;
    let updated = lib.updateEvent(eventINFO);
    if (updated) {
        res.status(200).send({ message: "Updated" });
    } else if (updated == null) {
        res.status(404).send({ message: "Time conflict!" })
    } else {
        res.status(400).end();
    }
}

function deleteEvent(req, res) {
    let eventID = req.params.id;
    let deleted = lib.deleteEvent(eventID);
    if (deleted) {
        res.status(200).end();
    } else if (deleted == null) {
        res.status(404).end();
    } else {
        res.status(302).end();
    }
}

function uploadEventImage(req, res) {
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

function getEventImage(req, res) {
    var imageName = req.params.name;
    var image = lib.getEventImage(imageName);
    if (image) {
        res.writeHead(200, { 'Content-Type': 'image/gif' });
        res.end(image, 'binary');
    } else {
        res.end(null);
    }
}

exports.addNewEvent = addNewEvent;
exports.getEvents = getEvents;
exports.getEvent = getEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.uploadEventImage = uploadEventImage;
exports.getEventImage = getEventImage;