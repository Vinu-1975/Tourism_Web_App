const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        min : 3,
        max: 20,
        unique : true
    },
    email : {
        type : String,
        required : true,
        min : 3,
        max : 40,
        unique: true,
    },
    phoneNumber : {
        type : String,
        required : true,
        min : 10,
        max : 10
    },
    gender : {
        type : String,
        enum : ['male','female','other'],
        required : true
    },
    password : {
        type : String,
        required : true,
        min : 8
    },
    profilePicture : {
        type : String,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
})

module.exports = mongoose.model('User',userSchema)