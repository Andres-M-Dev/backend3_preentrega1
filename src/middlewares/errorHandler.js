import { EErrors, errorStatus } from '../errors/EErrors.js';
import {
    generateInvalidIdInfo,
    generateNotFoundInfo
} from '../errors/info.js';

// Convierte errores conocidos de librerías (Mongoose, JWT, body-parser) a nuestros códigos
const normalizeError = (error) => {
    if (Object.values(EErrors).includes(error.code)) return error;

    if (error.name === 'CastError') {
        return { code: EErrors.INVALID_ID, name: 'Invalid ID', message: 'ID inválido', cause: generateInvalidIdInfo(error.value) };
    }
    if (error.name === 'ValidationError') {
        return { code: EErrors.INVALID_PARAM, name: 'Validation error', message: 'Datos inválidos', cause: error.message };
    }
    if (error.code === 11000) {
        return { code: EErrors.CONFLICT, name: 'Duplicate key', message: 'El recurso ya existe', cause: `Valor duplicado en: ${Object.keys(error.keyValue || {}).join(', ')}` };
    }
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return { code: EErrors.UNAUTHORIZED, name: 'Unauthorized', message: 'Token ausente, inválido o expirado', cause: error.message };
    }
    if (error.type === 'entity.parse.failed') {
        return { code: EErrors.INVALID_PARAM, name: 'Invalid JSON', message: 'El cuerpo de la petición no es un JSON válido', cause: error.message };
    }
    return { code: EErrors.INTERNAL, name: 'Internal error', message: 'Error interno del servidor', cause: 'Error no controlado', original: error };
}

// Middleware global de manejo de errores (debe registrarse al final en app.js)
export const errorHandler = (error, req, res, next) => {
    const normalized = normalizeError(error);
    const status = errorStatus[normalized.code] || 500;
    if (status === 500) console.error(normalized.original || error);
    res.status(status).send({
        status: 'error',
        code: normalized.code,
        error: normalized.name,
        message: normalized.message,
        cause: normalized.cause
    });
}

// Middleware para rutas inexistentes (se registra antes del errorHandler)
export const routeNotFound = (req, res, next) => {
    next({
        name: 'Route not found',
        code: EErrors.NOT_FOUND,
        message: 'Ruta no encontrada',
        cause: generateNotFoundInfo(`la ruta ${req.method} ${req.originalUrl}`)
    });
}

