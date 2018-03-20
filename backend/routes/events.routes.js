/**
 * @desc
 * Module provide routes for Create event, Retrive event/s, Update event and Delete event
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

var express = require('express');
var router = express.Router();
var controller = require('../services/events.services.js');

// Add new event
router.post('/event', controller.addNewEvent);
// Get all events
router.get('/events', controller.getEvents);
// Get expected event
router.get('/event/:id', controller.getEvent);
// Edit event
router.put('/event/:id', controller.updateEvent);
// Delete event
router.delete('/event/:id', controller.deleteEvent);
// Upload image
router.post('/event/upload',controller.uploadEventImage);
// Get image
router.get('/event/image/:name',controller.getEventImage);
module.exports = router;