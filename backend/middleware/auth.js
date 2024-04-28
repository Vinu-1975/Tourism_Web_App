const jwt = require('jsonwebtoken')
require('dotenv').config()

function generateToken(payload){
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
}

const verifyToken = (req,res,next) => {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(401).json({message:'Unauthorized: No token provided'})
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:'Unauthorized: Invalid token'})
        }
        req.user = decoded;
        next();
    })
}

module.exports = {
    generateToken,
    verifyToken
}