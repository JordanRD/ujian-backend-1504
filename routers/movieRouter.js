const router = require('express').Router();
const { getAllMovies, getMoviesQuery,addMovies,changeStatusMovies,setSchedule } = require('../controllers').movieController
const {verifyTokenMovies}=require('../helpers/tokenHelpers')
router.get('/get/all', getAllMovies)
router.get('/get',getMoviesQuery)
router.post('/add', verifyTokenMovies,addMovies)
router.patch('/edit/:id',verifyTokenMovies, changeStatusMovies)
router.patch('/set/:id',verifyTokenMovies, setSchedule)

module.exports = router