/**
 * @desc
 * Module provide routes for Create movie, Retrive movie/s, Update movie and Delete movie
 * @author
 * Created by mmihic (milos.mihic.17@singimail.rs) on 09.12.2017
 * @license
 * None
 */

 var express = require('express');
 var router = express.Router();
 var controller = require('../services/movies.services.js');
 
 // Add new Movie
 router.post('/movie', controller.addNewMovie);
 // Get all movies
 router.get('/movies', controller.getMovies);
 // Get expected movie
 router.get('/movie/:id', controller.getMovie);
 // Edit movie
 router.put('/movie/:id', controller.updateMovie);
 // Delete movie
 router.delete('/movie/:id', controller.deleteMovie);
 
 
 module.exports = router;