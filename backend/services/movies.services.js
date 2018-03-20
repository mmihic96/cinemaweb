/**
 * @desc
 * Module provide CRUD operations for movies
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

// Imported modules
var lib = require('../libs/movies.controller.js');

/**
 * Create new movie
 * @param {Object} req Request example - POST: /api/movie
 * @param {Object} res Response example - {
 *                                          "newMovieID": 1234
 *                                        }
 */
function addNewMovie(req, res) {
    let movie = req.body;
    let newID = lib.addNewMovie(movie);
    res.status(200).send({ newMovieID: newID });


}

function getMovies(req, res) {
    let movies = lib.getAllMovies();
    res.status(200).send(movies);
}

function getMovie(req, res) {
    let movieID = req.params.id;
    let movie = lib.findMovie(movieID);
    if (movie) {
        res.status(200).send(movie);
    } else {
        res.status(404).end();
    }
}

function updateMovie(req, res) {
    let movieInfo = req.body;
    let updated = lib.updateMovie(movieInfo);
    if (updated) {
        res.status(200).end();
    } else {
        res.status(400).end();
    }
}

function deleteMovie(req, res) {
    let movieID = req.params.id;
    let deleted = lib.deleteMovie(movieID);
    if (deleted) {
        res.status(200).end();
    } else {
        res.status(404).end();
    }
}

exports.addNewMovie = addNewMovie;
exports.getMovies = getMovies;
exports.getMovie = getMovie;
exports.updateMovie = updateMovie;
exports.deleteMovie = deleteMovie;