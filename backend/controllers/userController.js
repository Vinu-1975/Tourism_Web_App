const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const {generateToken} = require('../middleware/auth')
const jwt = require('jsonwebtoken')

module.exports.register = async (req,res) => {
    const saltRounds = 10
    try {
        console.log('registering')
        const { username, email,phoneNumber,gender, password } = req.body
        console.log(username, email, password)

        console.log('checking username in db')
        const checkUsername = await User.findOne({username})
        if (checkUsername) {
            return res.status(201).json({status:false,message : 'Username already exists'})
        }
        console.log('checking email in db')
        const checkEmail = await User.findOne({email})
        if (checkEmail) {
            return res.status(201).json({status:false,message : 'Email already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        console.log('creating user')
        const newUser = await User.create({
            username,
            email,
            phoneNumber,
            gender,
            password:hashedPassword,
        })
        console.log('user created')

        returnUser = {
            _id : newUser._id,
            username:newUser.username,
            email:newUser.email,
            phoneNumber:newUser.phoneNumber,
            gender : newUser.gender
        }
        console.log('registration successful')
        res.status(201).json({status:true,returnUser})
    }
    catch(err) {
        console.log('register error : ',err)
    }
}

module.exports.login = async (req,res) => {
    try {
        console.log('logging in')
        const { email, password } = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({message : 'User does not exist'})
        }
        const validPassword = await bcrypt.compare(password,user.password)
        if (!validPassword) {
            return res.status(400).json({message : 'Incorrect password'})
        }
        userData = {
            _id : user._id,
            username:user.username,
            email:user.email,
            phoneNumber : user.phoneNumber,
            gender : user.gender,
            token:generateToken({id:user._id})
        }
        console.log(userData)
        console.log('login successful')
        // res.redirect('http://127.0.0.1:5000/')
        res.status(200).json({userData})
    }catch(err) {
        console.log('login error : ',err)
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user: 'pkonami188@gmail.com',
        pass: 'zvywhotlqennwrns'
    }
})

module.exports.forgotPassword = async (req,res) => {
    console.log('forgot-password')
    const { email } = req.body
    console.log(email)
    try {
        const user = await User.findOne({email});
        if (!user){
            return res.status(201).json({message : 'User with this email does not exist'})
        }

        const token = generateToken({id:user._id})

        const mailOptions = {
            from : 'pkonami188@gmail.com',
            to: email,
            subject : 'Password Reset',
            html: `<p>You are receiving this email because you requested a password reset. Click <a href="http://localhost:5173/reset-password/${user._id}/${token}">here</a> to reset your password.</p>`
        }

        transporter.sendMail(mailOptions,(error,info) => {
            if (error) {
                console.log('Error sending email:',error)
                return res.status(201).json({status:false,message : 'Failed to send Mail'})
            }else{
                console.log('Email sent : ',info.response)
                return res.status(200).json({status:true,message : 'Email sent'})
            }
        })


    }catch(err){
        console.log('forgot password error : ',err)
        return res.status(500).json({message: 'Internal server error'})
    }
}

module.exports.resetPassword = async(req,res) => {
    console.log('reset password')
    const { id, token } = req.params
    const { newPassword } = req.body

    jwt.verify(token,process.env.JWT_SECRET,async (err,decoded) => {
        if (err) {
            console.log('Invalid token')
            return res.status(401).json({message : 'Invalid token'})
        }
        try {
            const user = await User.findById(id)
            if (!user) {
                console.log('User not found')
                return res.status(404).json({message : 'User not found'})
            }
            const hashedPassword = await bcrypt.hash(newPassword,10)
            user.password = hashedPassword
            await user.save()
            console.log('Password updated')
            return res.status(200).json({message : 'Password updated'})
        }catch(err){
            console.log('reset password error : ',err)
            return res.status(500).json({message : 'Internal server error'})
        }
})}

const request = require('request')

module.exports.flasktrial = async(req,res) => {
    console.log('flask trial')
    console.log(req.body)
    request('http://127.0.0.1:5000/ggg',function (err,response,body){
        console.error('error:', err); // Print the error
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the data received
        // res.send(body);
        res.json({message : 'flask trial',response,body})
    })
}
const axios = require('axios')

module.exports.cuisineRecc = async(req,res) => {
    console.log('cuisine recc')
    console.log(req.body)
    const options = {
        url: 'http://127.0.0.1:5000/rec',
        method: 'POST',
        json: true,  // Automatically stringify the JSON data
        body: req.body  // Send the request body (assumed to be JSON data)
    };

    // Make the POST request to the Flask server
    request(options, (error, response, body) => {
        if (error) {
            console.error('Error sending request to Flask:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.log('Received response from Flask:', body);

            // Send the received response back to the client
            res.json(body);
        }
    });
    // res.json({message : 'cuisine recc backend res'})
}