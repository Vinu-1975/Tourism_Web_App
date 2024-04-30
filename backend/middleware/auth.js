const jwt = require('jsonwebtoken')
require('dotenv').config()

function generateToken(payload){
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
}

const verifyToken = async (req,res,next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await UserActivation.findById(decoded.id).select("-password");
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // const token = req.headers.authorization;
    // if(!token) {
    //     return res.status(401).json({message:'Unauthorized: No token provided'})
    // }
    // jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
    //     if(err){
    //         return res.status(401).json({message:'Unauthorized: Invalid token'})
    //     }
    //     req.user = decoded;
    //     next();
    // })
}

module.exports = {
    generateToken,
    verifyToken
}