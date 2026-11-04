// Diccionario con los errores más comunes del proyecto
export const EErrors = {
    MISSING_DATA: 'MISSING_DATA',       // Faltan datos obligatorios
    INVALID_PARAM: 'INVALID_PARAM',     // Parámetro o dato con tipo/valor inválido
    INVALID_ID: 'INVALID_ID',           // ID con formato inválido
    NOT_FOUND: 'NOT_FOUND',             // Recurso o ruta no encontrada
    CONFLICT: 'CONFLICT',               // Recurso duplicado o acción no permitida
    UNAUTHORIZED: 'UNAUTHORIZED',       // Token ausente, inválido o expirado
    INTERNAL: 'INTERNAL_ERROR'          // Error interno del servidor
};

// Código HTTP asociado a cada tipo de error
export const errorStatus = {
    [EErrors.MISSING_DATA]: 400,
    [EErrors.INVALID_PARAM]: 400,
    [EErrors.INVALID_ID]: 400,
    [EErrors.NOT_FOUND]: 404,
    [EErrors.CONFLICT]: 400,
    [EErrors.UNAUTHORIZED]: 401,
    [EErrors.INTERNAL]: 500
};
