// const User = require("../model/user")
const User = require("../model/user")
const EmailVerification = require("../model/emailVerification")
const nodemailer = require("nodemailer")
const {isValidObject} = require('mongoose')
module.exports = {
    postUpdateUserAPI: async(req, res) => {   
        const {name, email, password} = req.body
        const oldUser = await User.findOne({email})
        if(oldUser) {
            return res.status(401).json({error: "This email is already in use"})
        }
        const newUser = new User({name, email, password})
        await newUser.save()
        let OTP = ""
        for (let i = 0; i <= 10; i++) {
            const randomVal= Math.round(Math.random() * 9)
            OTP += randomVal
        }
        const newEmailVerification = new EmailVerification({owner: newUser._id, token: OTP})
        await newEmailVerification.save()
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "c5ea61e048335e",
              pass: "9659ca95a6b2e4"
            }
        })
        transport.sendMail({
            from: 'testing@gmail.com',
            to: newUser.email,
            subject: 'Testing',
            html: 
            `
                <p> Your OTP </p>
                <h1>${OTP}</h1>
            `
        })
        res.status(201).json({message: "Please check mail. OTP has been sent to your email"})
    },

    verifyEmail: async(req, res) => {
        const {userId, OTP} = req.body
        if(!isValidObject(userId)) {
            return res.json({error: "Invalid user!"})
        }
        const user = await User.findById(userId)
        if(!user) return res.json({error: "User not found!"})
        if(user.isVerified) { 
            return res.json({error: "User already verified!"})
        }
        const token = await EmailVerification.findOne({owner : userId})
        if(!token) return res.json({error: "token not found!"})

        const isMatched = await token.compaireToken(OTP) 
        if(!isMatched) return res.json({error: " Please verify" })
        
        user.isVerified = true
        await user.save()
    },
}