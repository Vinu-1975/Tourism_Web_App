
const bcrypt = require('bcrypt')
const User = require('../models/userModel')


module.exports.register = async (req,res) => {
    const saltRounds = 10
    try {
        console.log('registering')
        const { username, email, password } = req.body
        console.log(username, email, password)

        console.log('checking username in db')
        const checkUsername = await User.findOne({username})
        if (checkUsername) {
            return res.status(400).json({message : 'Username already exists'})
        }
        console.log('checking email in db')
        const checkEmail = await User.findOne({email})
        if (checkEmail) {
            return res.status(400).json({message : 'Email already exists'})
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        console.log('creating user')
        const newUser = await User.create({
            username,
            email,
            password:hashedPassword
        })
        console.log('user created')

        returnUser = {
            _id : newUser._id,
            username:newUser.username,
            email:newUser.email,
        }
        console.log('registration successful')
        res.status(201).json({returnUser})
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
        }
        console.log('login successful')
        res.status(200).json({userData})
    }catch(err) {
        console.log('login error : ',err)
    }
}
