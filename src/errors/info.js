// Mensajes (cause) descriptivos para cada tipo de error común

export const generateMissingDataInfo = (fields) => {
    return `Faltan datos obligatorios. Campos requeridos: ${fields.join(', ')}.`;
}

export const generateInvalidParamInfo = (param, value, expected) => {
    return `El parámetro "${param}" recibió el valor "${value}". Se esperaba ${expected}.`;
}

export const generateInvalidIdInfo = (id) => {
    return `El id "${id}" no tiene un formato válido de ObjectId de MongoDB.`;
}

export const generateNotFoundInfo = (resource, id) => {
    return id ? `No existe ${resource} con id "${id}".` : `No se encontró ${resource}.`;
}

export const generateConflictInfo = (detail) => {
    return detail;
}
