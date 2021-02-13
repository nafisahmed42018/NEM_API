const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async'); 
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');


// @Desc        get bootcamp
// @route       GET /api/v1/bootcamps
// @access      public
exports.getBootcamps = asyncHandler (async (req, res, next) => {

    res.status(200).json(res.advancedResults);
    
})






// @Desc        get specified bootcamp
// @route       GET /api/v1/bootcamps
// @access      public
exports.getBootcamp = asyncHandler (async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse("Item doesn't exist",400));
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    });
})






// @Desc        create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      private
exports.createBootcamp = asyncHandler (async (req, res, next) => {

    //console.log(req.body)
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        message: "Bootcamp created",
        data: bootcamp
    });
       
})






// @Desc        create new bootcamp
// @route       PUT /api/v1/bootcamps
// @access      private
/*exports.updateBootcamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!bootcamp) {
            return next(new ErrorResponse("Item doesn't exist",400));
        }
        res.status(201).json({
            success: true,
            message: "Bootcamp updated",
            data: bootcamp
        })
    } catch (err) {
        next(err);
    }

}*/
exports.updateBootcamp = asyncHandler (async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        return next(new ErrorResponse("Item doesn't exist",400));
    }
    res.status(201).json({
        success: true,
        message: "Bootcamp updated",
        data: bootcamp
    })


})





// @Desc        create new bootcamp
// @route       DELETE /api/v1/bootcamps
// @access      private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse("Item doesn't exist", 400));
    }

    bootcamp.remove();
    res.status(201).json({         
        success: true,        
        message: "Bootcamp deleted"           
    })
    
        console.log()
})


// @Desc        
// @route       GET /api/v1/bootcamps/readius/:zipcode/:distance
// @access      private


exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {

    
    const { zipcode, distance } = req.params;   
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = distance / 6378;
    const bootcamps = await Bootcamp.find({

        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
        
    })

    res.status(200).json({         
        success: true,
        count: bootcamps.length,
        data: bootcamps          
    })
    
})




// @Desc        upload photo for bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse("Item doesn't exist", 400));
    }

    if(!req.files) {
        return next(new ErrorResponse("Please attach a file", 400));
    }

    console.log(req.files)

    //Image upload verification
    const file = req.files.file;
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse("Only photos can be attached", 400));
    }


    //Check filesize

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`File size exceeds the ${process.env.MAX_FILE_UPLOAD} byte limit`, 400));
    }

    //Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    console.log(file.name)

    //move file to specified directory
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with uploading the file`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({         
            success: true,
            data: file.name       
        })
    })
})