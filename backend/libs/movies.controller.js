/**
 * @desc
 * Module provide controllers for CRUD operations in movies.services module
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

// Imported modules
var fs = require('fs');
var path = require('path');

// Constants
const PATH_TO_MOVIES = path.join(__dirname, '..', 'data', 'movies.json');
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
 * Read movies from file
 * @param {String} path
 * @return {Array} Array of movies 
 */
function readMovies() {
    if (pathExist(PATH_TO_MOVIES)) {
        return fs.readFileSync(PATH_TO_MOVIES, ENCODING);
    } else {
        return JSON.stringify([]);
    }
}

/**
 * Add new movie object to file
 * @param {Object} movie 
 * @return {Integer} new movie id
 */
function addNewMovie(movie) {
    let movies = JSON.parse(readMovies());
    let ID = null;
    if (movies.length == 0) {
        ID = 1;
    } else {
        ID = movies[movies.length - 1].id + 1;
    }
    movie.id = ID;
    movies.push(movie);
    fs.writeFileSync(PATH_TO_MOVIES, JSON.stringify(movies, null, 2), 'utf8');
    return ID;
}

/**
 * Get all movies from file
 * @return {Array} array of movies
 */
function getAllMovies() {
    return JSON.parse(readMovies());
}

/**
 * Find movie by movie id
 * @param {Integer} id 
 * @return {Object} if exist or null if not
 */
function findMovie(id) {
    let movies = JSON.parse(readMovies());
    for (i = 0; i < movies.length; i++) {
        if (movies[i].id == id) {
            return movies[i];
        }
    }

    return null;
}

/**
 * Delete movie from file
 * @param {Integer} id 
 * @return {Boolean} true || false
 */
function deleteMovie(id) {
    let movies = JSON.parse(readMovies());
    let found = false;
    for (i = 0; i < movies.length; i++) {
        if (movies[i].id == id) {
            movies.splice(i, 1);
            found = true;
        }
    }
    fs.writeFileSync(PATH_TO_MOVIES, JSON.stringify(movies, null, 2), 'utf8');
    return found;
}

/**
 * Update movie information
 * @param {Object} movieInfo 
 * @return {Boolean} True || False depends if movie exist
 */
function updateMovie(movieInfo) {
    var movies = JSON.parse(readMovies());
    for (let i = 0; i < movies.length; i++) {
        if (movies[i].id == movieInfo.id) {
            movies[i].name = movieInfo.name;
            movies[i].type = movieInfo.type;
            movies[i].duration = movieInfo.duration;
            movies[i].ytID = movieInfo.ytID;
            fs.writeFileSync(PATH_TO_MOVIES, JSON.stringify(movies, null, 2), 'utf8');
            return true;
        }
    }
    return false;
}

exports.addNewMovie = addNewMovie;
exports.getAllMovies = getAllMovies;
exports.findMovie = findMovie;
exports.deleteMovie = deleteMovie;
exports.updateMovie = updateMovie;