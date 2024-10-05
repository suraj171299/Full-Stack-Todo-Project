const nodemailer = require('nodemailer');
const { VERIFICATION_EMAIL_TEMPLATE } = require('../utils/emailTemplate');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);


const sendOtpToEmail = async(email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: email, // list of receivers
            subject: "Email verification", // Subject line
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",otp), // html body
        });
    
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error(error, 'Error sending email Otp');
        throw new Error(error.message,"Failed to send email;")
    }
}

module.exports = {
    sendOtpToEmail
}