import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils/index.js";
import CustomError from "../errors/CustomError.js";
import { EErrors } from "../errors/EErrors.js";
import { generateMissingDataInfo, generateNotFoundInfo } from "../errors/info.js";

const missingPetData = (fields) => CustomError.createError({
    name:"Incomplete values",
    cause:generateMissingDataInfo(fields),
    message:"Incomplete values",
    code:EErrors.MISSING_DATA
});

const getAllPets = async(req,res,next)=>{
    try {
        const pets = await petsService.getAll();
        res.send({status:"success",payload:pets})
    } catch (error) {
        next(error);
    }
}

const createPet = async(req,res,next)=> {
    try {
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) throw missingPetData(["name","specie","birthDate"]);
        const pet = PetDTO.getPetInputFrom({name,specie,birthDate});
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    } catch (error) {
        next(error);
    }
}

const updatePet = async(req,res,next) =>{
    try {
        const petUpdateBody = req.body;
        const petId = req.params.pid;
        const result = await petsService.update(petId,petUpdateBody);
        if(!result) throw CustomError.createError({
            name:"Pet not found",
            cause:generateNotFoundInfo("una mascota",petId),
            message:"Pet not found",
            code:EErrors.NOT_FOUND
        });
        res.send({status:"success",message:"pet updated"})
    } catch (error) {
        next(error);
    }
}

const deletePet = async(req,res,next)=> {
    try {
        const petId = req.params.pid;
        const result = await petsService.delete(petId);
        if(!result) throw CustomError.createError({
            name:"Pet not found",
            cause:generateNotFoundInfo("una mascota",petId),
            message:"Pet not found",
            code:EErrors.NOT_FOUND
        });
        res.send({status:"success",message:"pet deleted"});
    } catch (error) {
        next(error);
    }
}

const createPetWithImage = async(req,res,next) =>{
    try {
        const file = req.file;
        const {name,specie,birthDate} = req.body;
        if(!name||!specie||!birthDate) throw missingPetData(["name","specie","birthDate"]);
        if(!file) throw missingPetData(["image"]);
        console.log(file);
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image:`${__dirname}/../public/img/${file.filename}`
        });
        console.log(pet);
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
    } catch (error) {
        next(error);
    }
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}
