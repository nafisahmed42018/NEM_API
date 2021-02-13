const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async'); 
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');


// @desc get courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public

exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {

        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        
        return res.status(200).json({
            succes: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults);
    }

    
})


// @desc get single course
// @route GET /api/v1/bootcamps/:Id
// @access public

exports.getCourse = asyncHandler(async (req, res, next) => {
    
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name'
    });

    if (!course) {
        return next(new ErrorResponse(`NO course with the id of ${req.params.id}`),404);
    }
 
    res.status(200).json({
        succes: true,
        count: course.length,
        data: course
    })
})


// @desc add course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access private

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`),404);
    }

    const course = await Course.create(req.body);
    res.status(201).json({
        succes: true,
        data: course
    })
})


// @desc update course
// @route PUT /api/v1/bootcamps/:idd
// @access private

exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`NO course with the id of ${req.params.id}`),404);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(201).json({
        succes: true,
        data: course
    })
})


// @desc delete course
// @route DELETE /api/v1/bootcamps/:id
// @access private

exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`NO course with the id of ${req.params.id}`),404);
    }

    await course.remove();
    res.status(201).json({
        succes: true,
        data: {}
    })
})