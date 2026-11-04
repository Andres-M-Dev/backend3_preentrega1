import { adoptionsService, petsService, usersService } from "../services/index.js"
import CustomError from "../errors/CustomError.js";
import { EErrors } from "../errors/EErrors.js";
import { generateConflictInfo, generateNotFoundInfo } from "../errors/info.js";

const getAllAdoptions = async(req,res,next)=>{
    try {
        const result = await adoptionsService.getAll();
        res.send({status:"success",payload:result})
    } catch (error) {
        next(error);
    }
}

const getAdoption = async(req,res,next)=>{
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({_id:adoptionId})
        if(!adoption) throw CustomError.createError({
            name:"Adoption not found",
            cause:generateNotFoundInfo("una adopción",adoptionId),
            message:"Adoption not found",
            code:EErrors.NOT_FOUND
        });
        res.send({status:"success",payload:adoption})
    } catch (error) {
        next(error);
    }
}

const createAdoption = async(req,res,next)=>{
    try {
        const {uid,pid} = req.params;
        const user = await usersService.getUserById(uid);
        if(!user) throw CustomError.createError({
            name:"User not found",
            cause:generateNotFoundInfo("un usuario",uid),
            message:"User not found",
            code:EErrors.NOT_FOUND
        });
        const pet = await petsService.getBy({_id:pid});
        if(!pet) throw CustomError.createError({
            name:"Pet not found",
            cause:generateNotFoundInfo("una mascota",pid),
            message:"Pet not found",
            code:EErrors.NOT_FOUND
        });
        if(pet.adopted) throw CustomError.createError({
            name:"Pet already adopted",
            cause:generateConflictInfo(`La mascota con id "${pid}" ya fue adoptada.`),
            message:"Pet is already adopted",
            code:EErrors.CONFLICT
        });
        user.pets.push(pet._id);
        await usersService.update(user._id,{pets:user.pets})
        await petsService.update(pet._id,{adopted:true,owner:user._id})
        await adoptionsService.create({owner:user._id,pet:pet._id})
        res.send({status:"success",message:"Pet adopted"})
    } catch (error) {
        next(error);
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}
