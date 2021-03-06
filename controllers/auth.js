const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @Desc        register bootcamp
// @route       POST /api/v1/auth/register
// @access      public


exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, password, role } = req.body;
    const user = await User.create({
        name,email,password,role
    })

    //create token
    sendTokenResponse(user, 200, res)
})





// @Desc        login to bootcamp
// @route       POST /api/v1/auth/login
// @access      public

exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorResponse('Email or Password missing', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid Credentials',401))
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid Credentials',401))
    }

    //create token
    sendTokenResponse(user, 200, res);
})


//get token from model, create cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJWT();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV == 'production') {
        options.secure = true;
    }


    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};
