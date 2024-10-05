const model = require('../models');
const { sendOtpToEmail } = require('../service/email.provider');
const { generateToken } = require('../utils/generateToken');
const { generateUUID } = require('../utils/generateUuid');
const { respond } = require('../utils/responseHandler');
const bcrypt = require('bcrypt');


const signup = async (req, res) => {
    try {
        const id = generateUUID();
        const { email, name, password } = req.body;
        
        const existingUser = await model.User.findOne({ where: {email} });
        if(existingUser){
            respond(res, 400, "User already exists, Please Login");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationOtp = Math.floor(100000 + Math.random() * 900000).toString();

        user = await model.User.create(({
            id,
            email,
            password: hashedPassword,
            name,
            verificationOtp,
            otpExpiry: Date.now() + 10 * 60 * 1000,
        }))

        await sendOtpToEmail(user.email, verificationOtp);

        const token = generateToken(user);
        res.cookie("token", token, {maxAge: 500000, httpOnly: true});

        return respond(res, 201, "User created successfully, Kindly check your email for OTP verification",{
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: false,
        })

    } catch (error) {
        return respond(res, 500, "Something went wrong")        
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { verificationOtp} = req.body;
        const user = await model.User.findOne({ where: {verificationOtp} });

        if(!user){
            return respond(res, 400, "Invalid OTP");
        }

        if(user.otpExpiry < Date.now()){
            return respond(res, 400, "OTP Expired");
        }

        user.verificationOtp = null;
        user.otpExpiry = null;
        user.isVerified = true;

        await user.save();

        return respond(res, 200, "Email Verified Successfully",{
            id: user.id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified,
        });
    } catch (error) {
        return respond(res, 500, "Something went wrong")
    }
}



module.exports = {
    signup,
    verifyOtp
}