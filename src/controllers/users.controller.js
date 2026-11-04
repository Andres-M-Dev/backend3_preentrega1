import { usersService } from "../services/index.js"
import CustomError from "../errors/CustomError.js";
import { EErrors } from "../errors/EErrors.js";
import { generateNotFoundInfo } from "../errors/info.js";

const userNotFound = (userId) => CustomError.createError({
    name:"User not found",
    cause:generateNotFoundInfo("un usuario",userId),
    message:"User not found",
    code:EErrors.NOT_FOUND
});

const getAllUsers = async(req,res,next)=>{
    try {
        const users = await usersService.getAll();
        res.send({status:"success",payload:users})
    } catch (error) {
        next(error);
    }
}

const getUser = async(req,res,next)=> {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) throw userNotFound(userId);
        res.send({status:"success",payload:user})
    } catch (error) {
        next(error);
    }
}

const updateUser =async(req,res,next)=>{
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) throw userNotFound(userId);
        const result = await usersService.update(userId,updateBody);
        res.send({status:"success",message:"User updated"})
    } catch (error) {
        next(error);
    }
}

const deleteUser = async(req,res,next) =>{
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) throw userNotFound(userId);
        await usersService.delete(userId);
        res.send({status:"success",message:"User deleted"})
    } catch (error) {
        next(error);
    }
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}
