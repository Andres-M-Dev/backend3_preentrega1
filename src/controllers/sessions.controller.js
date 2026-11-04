import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils/index.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import CustomError from "../errors/CustomError.js";
import { EErrors } from "../errors/EErrors.js";
import { generateConflictInfo, generateMissingDataInfo, generateNotFoundInfo } from "../errors/info.js";

const missingData = (fields) => CustomError.createError({
    name:"Incomplete values",
    cause:generateMissingDataInfo(fields),
    message:"Incomplete values",
    code:EErrors.MISSING_DATA
});

const userDoesntExist = (email) => CustomError.createError({
    name:"User doesn't exist",
    cause:generateNotFoundInfo(`un usuario con el email "${email}"`),
    message:"User doesn't exist",
    code:EErrors.NOT_FOUND
});

const incorrectPassword = () => CustomError.createError({
    name:"Incorrect password",
    cause:"La contraseña ingresada no coincide con la del usuario.",
    message:"Incorrect password",
    code:EErrors.INVALID_PARAM
});

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) throw missingData(["first_name","last_name","email","password"]);
        const exists = await usersService.getUserByEmail(email);
        if (exists) throw CustomError.createError({
            name:"User already exists",
            cause:generateConflictInfo(`Ya existe un usuario con el email "${email}".`),
            message:"User already exists",
            code:EErrors.CONFLICT
        });
        const hashedPassword = await createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        console.log(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw missingData(["email","password"]);
        const user = await usersService.getUserByEmail(email);
        if(!user) throw userDoesntExist(email);
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) throw incorrectPassword();
        const userDto = UserDTO.getUserTokenFrom(user);
        const token = jwt.sign(userDto,'tokenSecretJWT',{expiresIn:"1h"});
        res.cookie('coderCookie',token,{maxAge:3600000}).send({status:"success",message:"Logged in"})
    } catch (error) {
        next(error);
    }
}

const current = async(req,res,next) =>{
    try {
        const cookie = req.cookies['coderCookie']
        const user = jwt.verify(cookie,'tokenSecretJWT');
        if(user)
            return res.send({status:"success",payload:user})
    } catch (error) {
        next(error);
    }
}

const unprotectedLogin  = async(req,res,next) =>{
    try {
        const { email, password } = req.body;
        if (!email || !password) throw missingData(["email","password"]);
        const user = await usersService.getUserByEmail(email);
        if(!user) throw userDoesntExist(email);
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) throw incorrectPassword();
        const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
        res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
    } catch (error) {
        next(error);
    }
}
const unprotectedCurrent = async(req,res,next)=>{
    try {
        const cookie = req.cookies['unprotectedCookie']
        const user = jwt.verify(cookie,'tokenSecretJWT');
        if(user)
            return res.send({status:"success",payload:user})
    } catch (error) {
        next(error);
    }
}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}
