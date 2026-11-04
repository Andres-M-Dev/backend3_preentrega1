import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';

const PASSWORD = 'coder123';
const PET_SPECIES = ['dog', 'cat', 'bird', 'fish', 'hamster'];

// Genera "quantity" usuarios con el mismo formato que devolvería Mongo
export const generateUsers = async (quantity) => {
    // La contraseña se encripta una sola vez y se reutiliza (evita miles de bcrypt)
    const hashedPassword = await createHash(PASSWORD);
    const users = [];
    for (let i = 0; i < quantity; i++) {
        const first_name = faker.person.firstName();
        const last_name = faker.person.lastName();
        const [local, domain] = faker.internet
            .email({ firstName: first_name, lastName: last_name, provider: 'mock.com' })
            .split('@');
        users.push({
            _id: new mongoose.Types.ObjectId(),
            first_name,
            last_name,
            email: `${local}.${randomUUID().slice(0, 6)}@${domain}`,
            password: hashedPassword,
            role: faker.helpers.arrayElement(['user', 'admin']),
            pets: []
        });
    }
    return users;
}

// Genera "quantity" mascotas con el formato del modelo Pet
export const generatePets = (quantity) => {
    const pets = [];
    for (let i = 0; i < quantity; i++) {
        pets.push({
            _id: new mongoose.Types.ObjectId(),
            name: faker.person.firstName(),
            specie: faker.helpers.arrayElement(PET_SPECIES),
            birthDate: faker.date.past({ years: 10 }),
            adopted: false,
            image: ''
        });
    }
    return pets;
}
