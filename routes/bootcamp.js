const express = require('express');
const router = express.Router();
// Included courses
const courseRouter = require('./courses');
const { getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsWithinRadius,
    bootcampPhotoUpload
} = require("../controllers/bootcamp");
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResult')
// Re-route to other resources
router.use('/:bootcampId/courses', courseRouter);


router.route('/')
    .get(advancedResults(Bootcamp,'courses'), getBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getBootcamp) 
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('/:id/photo').put(bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsWithinRadius)

module.exports = router;







/*router.get("/api/v1/bootcamps", (req, res) => {

    ///res.send({type: "JSON"})
    //res.send("<h1>Hello from express</h1>");
    //res.sendStatus(404);
    //res.status(400).json({success: false, message: "Request doesn't exist"})
    res.status(200).json({success:true,message: 'Show all bootcamps', data:{id:1,user:"Admin"}})
    
})
*/