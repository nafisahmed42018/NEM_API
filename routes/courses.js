const express = require('express');
const router = express.Router({ mergeParams: true });


const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse } = require('../controllers/course');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResult');


router.route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select:'name'
    }),getCourses)
    .post(addCourse);


router.route('/:id') 
    .get(getCourse)
    .put(updateCourse)
    .delete(deleteCourse);
//router.route('')

module.exports = router;