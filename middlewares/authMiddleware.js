import JWT from 'jsonwebtoken';
import userModel from '../models/usermodels.js';

//Protected Routes token base
export const requireSignIN = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        // console.log(error);
    }
};

//admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if(user.role === 1){
            next();
        }else{
            return res.send({
                success: false,
                message: 'Unauthorized Access',
            });
        }
    } catch (error) {
        // console.log(error);
        res.status(401).send({
            success: false,
            error, 
            message: 'Error in Admin Middleware',
        });
    }
};
