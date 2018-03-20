
/**
 * @desc
 * Module provide controllers for CRUD operations in events.services module
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 25.01.2018
 * @license
 * None
 */

// Imported modules
var fs = require('fs');
var path = require('path');
var moviesController = require('./movies.controller');

// Constants
const PATH_TO_EVENTS = path.join(__dirname, '..', 'data', 'events.json');
const PATH_TO_HALLS = path.join(__dirname, '..', 'data', 'halls.json');
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
 * Read events from file
 * @param {String} path
 * @return {Array} Array of events 
 */
function readEvents() {
    if (pathExist(PATH_TO_EVENTS)) {
        return fs.readFileSync(PATH_TO_EVENTS, ENCODING);
    } else {
        return JSON.stringify([]);
    }
}

/**
 * Find hall by hall id
 * @param {String} id 
 * @return {Object} hall if exist, if not return null
 */
function findHall(id) {
    let halls = JSON.parse(fs.readFileSync(PATH_TO_HALLS, 'utf8'));
    for (let i = 0; i < halls.length; i++) {
        if (halls[i].id == id) {
            return halls[i];
        }
    }
    return null;
}

/**
 * Create new object for every event. Complete event object with movie information and hall information
 * @return {Array} Array of events
 */
function getAllEvents() {
    let events = JSON.parse(readEvents());

    let allEvents = [];
    for (let i = 0; i < events.length; i++) {
        let event = {
            "id": null,
            "hallID": null,
            "movieName": null,
            "dateTime": null,
            "movieDuration": null,
            "price": null,
            "seat_number": null,
            "movieType": null,
            "deleted": null,
            "movieTrailer": null,
            "imageName": null,
            "movieID": null
        }
        let movie = moviesController.findMovie(events[i].movieID);
        if (!movie) {
            continue;
        }
        let hall = findHall(events[i].hallID);
        event.id = events[i].id;
        event.hallID = events[i].hallID;
        event.movieName = movie.name;
        event.dateTime = events[i].dateTime;
        event.movieDuration = movie.duration;
        event.price = events[i].price;
        event.movieType = movie.type;
        event.deleted = events[i].deleted;
        event.seat_number = events[i].seat_available;
        event.movieTrailer = movie.ytID;
        event.imageName = events[i].imageName;
        event.movieID = events[i].movieID;
        allEvents.push(event);
    }
    return allEvents;
}

/**
 * Find event by event id
 * @param {Integer} eventID 
 * @return {Object} event object if exist, if not return null
 */
function findEvent(eventID) {
    let events = JSON.parse(readEvents());
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == eventID) {
            return events[i];
        }
    }
    return null;
}

/**
 * Create new event and store in file
 * @param {Object} event 
 * @return {Integer} new event id
 */
function addNewEvent(event) {
    let events = JSON.parse(readEvents());
    let hall = findHall(event.hallID);
    let eventID = null;
    if (events.length == 0) {
        eventID = 1;
    } else {
        eventID = events[events.length - 1].id + 1;
    }
    let eventsOnDate = checkDate(event.dateTime, event.hallID);
    let movieDuration = moviesController.findMovie(Number(event.movieID)).duration;
    let wh = event.dateTime.split(' ')[1].split(':')[0] * 60;
    let wt = wh + event.dateTime.split(' ')[1].split(':')[1];
    let final = 0;
    if (wt + movieDuration >= 1440) {
        nextDay = Number(event.dateTime.split(' ')[0].split('/')[0] + 1);
        if (['01', '03', '05', '07', '08', '10', '12'].includes(event.dateTime.split(' ')[0].split('/')[1])) {
            if (nextDay > 31) {
                nextDay = '01';
                if (event.dateTime.split(' ')[0].split('/')[1] < 10) {
                    final = nextDay + '/' + '0' + (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1) + '/' + event.dateTime.split(' ')[0].split('/')[2]
                } else {
                    if (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1 > 12) {
                        final = nextDay + '/' + '01' + '/' + (Number(event.dateTime.split(' ')[0].split('/')[2]) + 1);
                    } else {
                        final = nextDay + '/' + (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1) + '/' + event.dateTime.split(' ')[0].split('/')[2]
                    }
                }
            }
        } else if (['02', '04', '06', '09', '11'].includes(event.dateTime.split(' ')[0].split('/')[1])) {
            if (nextDay > 30) {
                nextDay = '01';
                if (event.dateTime.split(' ')[0].split('/')[1] < 10) {
                    final = nextDay + '/' + '0' + (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1) + '/' + event.dateTime.split(' ')[0].split('/')[2]
                } else {
                    if (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1 > 12) {
                        final = nextDay + '/' + '01' + '/' + (Number(event.dateTime.split(' ')[0].split('/')[2]) + 1);
                    } else {
                        final = nextDay + '/' + (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1) + '/' + event.dateTime.split(' ')[0].split('/')[2]
                    }
                }
            }
        }
        if (!checkAfterMidnight(wt + movieDuration, final)) {
            if (checkTimeConflict(event.dateTime.split(' ')[1], movieDuration, eventsOnDate)) {
                event['id'] = eventID;
                event['seat_available'] = Number(hall.seatAvailable);
                events.push(event);
                fs.writeFileSync(PATH_TO_EVENTS, JSON.stringify(events, null, 2), 'utf8');
                return eventID;
            } else {
                return null;
            }
        }
    }
    return null;
}

/**
 * Set event property "deleted" to true
 * @param {Integer} eventID 
 * @return {Boolean} true || false
 */
function deleteEvent(eventID) {
    let events = JSON.parse(readEvents());
    let founded = null;
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == eventID) {
            if (events[i].deleted) {
                return false;
            }
            events[i].deleted = true;
            founded = true;
        }
    }
    fs.writeFileSync(PATH_TO_EVENTS, JSON.stringify(events, null, 2), 'utf8');
    return founded;
}

/**
 * Update event with new information
 * @param {Object} event 
 * @return true || false || null 
 */
function updateEvent(event) {
    var eventToSkip = null;
    var events = JSON.parse(readEvents());
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == event.eventID) {

            events[i].hallID = event.hallID;
            events[i].movieID = event.movieID;
            events[i].dateTime = event.dateTime;
            events[i].price = event.price;
            if (event.imageName) {
                events[i].imageName = event.imageName;
            }
            if (event.seat_available) {
                events[i].seat_available = event.seat_available;
            }
            if (events[i].dateTime == event.dateTime) {
                eventToSkip = events[i].id;
            }
            let eventsOnDate = checkDate(event.dateTime, event.hallID, eventToSkip);
            let movieDuration = moviesController.findMovie(event.movieID).duration;

            let wh = event.dateTime.split(' ')[1].split(':')[0] * 60;
            let wt = wh + event.dateTime.split(' ')[1].split(':')[1];
            let final = 0;
            if (wt + movieDuration >= 1440) {
                nextDay = Number(event.dateTime.split(' ')[0].split('/')[0] + 1);
                if (['01', '03', '05', '07', '08', '10', '12'].includes(event.dateTime.split(' ')[0].split('/')[1])) {
                    if (nextDay > 31) {
                        nextDay = '01';
                        if (event.dateTime.split(' ')[0].split('/')[1] < 10) {
                            final = nextDay + '/' + '0' + (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1) + '/' + event.dateTime.split(' ')[0].split('/')[2]
                        } else {
                            if (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1 > 12) {
                                final = nextDay + '/' + '01' + '/' + (Number(event.dateTime.split(' ')[0].split('/')[2]) + 1);
                            } else {
                                final = nextDay + '/' + (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1) + '/' + event.dateTime.split(' ')[0].split('/')[2]
                            }
                        }
                    }
                } else if (['02', '04', '06', '09', '11'].includes(event.dateTime.split(' ')[0].split('/')[1])) {
                    if (nextDay > 30) {
                        nextDay = '01';
                        if (event.dateTime.split(' ')[0].split('/')[1] < 10) {
                            final = nextDay + '/' + '0' + (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1) + '/' + event.dateTime.split(' ')[0].split('/')[2]
                        } else {
                            if (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1 > 12) {
                                final = nextDay + '/' + '01' + '/' + (Number(event.dateTime.split(' ')[0].split('/')[2]) + 1);
                            } else {
                                final = nextDay + '/' + (Number(event.dateTime.split(' ')[0].split('/')[1]) + 1) + '/' + event.dateTime.split(' ')[0].split('/')[2]
                            }
                        }
                    }
                }
                if (!checkAfterMidnight(wt + movieDuration, final)) {
                    if (checkTimeConflict(event.dateTime.split(' ')[1], movieDuration, eventsOnDate)) {
                        fs.writeFileSync(PATH_TO_EVENTS, JSON.stringify(events, null, 2), 'utf8');
                        return true;
                    } else {
                        return null;
                    }
                }
            }
        }
    }
    return false;
}
/**
 * Function find events on given date and hall
 * @param {String} pickedDate Given date
 * @param {String} hall Given hall
 * @param {Integer} skipEvent When adding new event its null, when updating existing event its event id. This is for skipping updating event
 * @return {Array} array of events on that date and hall
 */
function checkDate(pickedDate, hall, skipEvent = null) {
    let events = JSON.parse(readEvents());
    let dateToCheck = pickedDate.split(' ')[0];
    let eventsToCheck = [];
    for (let i = 0; i < events.length; i++) {
        if (events[i].id == skipEvent || events[i].deleted) {
            continue;
        }
        let eventDate = events[i].dateTime.split(' ')[0];
        if (eventDate == dateToCheck && events[i].hallID == hall) {
            eventsToCheck.push(events[i]);
        }
    }
    return eventsToCheck;
}

function checkAfterMidnight(wantedTime, date) {
    let events = JSON.parse(readEvents());
    for (let i = 0; i < events.length; i++) {
        if (events[i].dateTime.split(' ')[0] == date) {
            let h = events[i].dateTime.split(' ')[1].split(':')[0];
            let m = events[i].dateTime.split(' ')[1].split(':')[1];
            let whm = wantedTime.split(':')[0];
            let wmm = wantedTime.split(':')[1];
            if (h < whm) {
                return true;
            } else if (h == wm) {
                if (h < wmm) {
                    return true;
                }
            }
        }
    }
    return false;
}
/**
 * Function check if event can be shown in that time
 * @param {String} wantedTime Given time
 * @param {Integer} movieDuration movie duration for that event
 * @param {Array} events array ov events on given date
 * @return {Boolean} true || false
 */
function checkTimeConflict(wantedTime, movieDuration, events) {
    if (events.length < 1) {
        return true;
    }
    let before = findBefore(wantedTime, events);
    let after = findAfter(wantedTime, events);

    if (after == 1500) {
        after += after;
    }

    let wt = Number(wantedTime.split(':')[0] * 60) + Number(wantedTime.split(':')[1]);
    if (wt >= before && wt + Number(movieDuration) <= after) {
        return true;
    }
    return false;
}

/**
 * Function find closest time after given time
 * @param {String} t Given time
 * @param {Array} events array of events on given date
 * @return {String} closest time after
 */
function findAfter(t, events) {
    let time = Number(t.split(':')[0] * 60) + Number(t.split(':')[1]);
    let timeAfter = 1500;
    let md = 0;
    for (let i = 0; i < events.length; i++) {
        let timestime = Number(events[i].dateTime.split(' ')[1].split(':')[0] * 60) + Number(events[i].dateTime.split(' ')[1].split(':')[1]);
        let movie = moviesController.findMovie(events[i].movieID);
        if (timestime > time && timestime < timeAfter) {
            timeAfter = timestime;
        }
    }
    return timeAfter;
}

/**
 * Function find closest time before given time
 * @param {String} t given time
 * @param {Array} events array of events on given date
 * @return {String} closest time before
 */
function findBefore(t, events) {
    let time = Number(t.split(':')[0] * 60) + Number(t.split(':')[1]);
    let timeBefore = 0;
    let md = 0;
    for (let i = 0; i < events.length; i++) {
        let timestime = Number(events[i].dateTime.split(' ')[1].split(':')[0] * 60) + Number(events[i].dateTime.split(' ')[1].split(':')[1]);
        let movie = moviesController.findMovie(events[i].movieID);
        if (timestime <= time && timestime > timeBefore) {
            timeBefore = timestime;
            md = movie.duration;
        }
    }
    return timeBefore + Number(md);
}

/**
 * Movie given file to another location
 * @param {File} sampleFile File
 * @param {Function} cb callback function
 */
function uploadImage(sampleFile, cb) {
    let location = path.join(__dirname, '..', 'uploads', sampleFile.name);
    sampleFile.mv(location, function (err) {
        if (err) {
            return cb(err, null);
        }
        return cb(null, sampleFile.name);
    });
}

function getEventImage(imageName) {
    var pathToImage = path.join(__dirname, '..', 'uploads', imageName);
    if (pathExist(pathToImage)) {
        return fs.readFileSync(pathToImage);
    }
    return null;
}
exports.getAllEvents = getAllEvents;
exports.findEvent = findEvent;
exports.addNewEvent = addNewEvent;
exports.deleteEvent = deleteEvent;
exports.updateEvent = updateEvent;
exports.uploadImage = uploadImage;
exports.getEventImage = getEventImage;