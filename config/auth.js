const jwt = require('jsonwebtoken');

auth = (req,res,next) => {
    //verify the json web toke nthat is passed from the request

    const token = req.header('x-auth-token');

    if(!token){
        res.status(401).json({msg: 'unauthorized access'});
    }else{
        try {
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
            req.user = decodedToken;
            next();
        } catch (error) {
            res.status(400).json({msg: 'token not found'});
        }
    }
}

module.exports = auth;