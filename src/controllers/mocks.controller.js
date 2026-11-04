import { generatePets, generateUsers } from "../mocks/mocking.module.js";
import { petsService, usersService } from "../services/index.js";
import CustomError from "../errors/CustomError.js";
import { EErrors } from "../errors/EErrors.js";
import { generateInvalidParamInfo, generateMissingDataInfo } from "../errors/info.js";

// Valida que el valor sea un entero mayor o igual a 0
const parseQuantity = (name, value) => {
    if (value === undefined || value === null || value === '') {
        throw CustomError.createError({
            name: 'Missing data',
            cause: generateMissingDataInfo(['users', 'pets']),
            message: 'Faltan datos obligatorios',
            code: EErrors.MISSING_DATA
        });
    }
    const number = Number(value);
    if (!Number.isInteger(number) || number < 0) {
        throw CustomError.createError({
            name: 'Invalid param',
            cause: generateInvalidParamInfo(name, value, 'un número entero mayor o igual a 0'),
            message: `El parámetro ${name} es inválido`,
            code: EErrors.INVALID_PARAM
        });
    }
    return number;
}

const getMockingPets = async (req, res, next) => {
    try {
        const pets = generatePets(100);
        res.send({ status: "success", payload: pets });
    } catch (error) {
        next(error);
    }
}

const getMockingUsers = async (req, res, next) => {
    try {
        const users = await generateUsers(50);
        res.send({ status: "success", payload: users });
    } catch (error) {
        next(error);
    }
}

const generateData = async (req, res, next) => {
    try {
        const { users, pets } = req.body || {};
        const usersQuantity = parseQuantity('users', users);
        const petsQuantity = parseQuantity('pets', pets);

        const generatedUsers = await generateUsers(usersQuantity);
        const generatedPets = generatePets(petsQuantity);

        if (usersQuantity > 0) await usersService.create(generatedUsers);
        if (petsQuantity > 0) await petsService.create(generatedPets);

        res.send({
            status: "success",
            message: "Data generated and inserted",
            payload: { users: usersQuantity, pets: petsQuantity }
        });
    } catch (error) {
        next(error);
    }
}

export default {
    getMockingPets,
    getMockingUsers,
    generateData
}
