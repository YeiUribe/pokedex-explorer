// Codigos de error del servicio -> mensajes para el usuario (UI en espanol).
const ERROR_MESSAGES = {
  NOT_FOUND: 'No se encontro ningun Pokemon con ese nombre o numero.',
  NETWORK: 'No se pudo conectar con el servidor. Revisa tu conexion a internet.',
  TIMEOUT: 'La conexion tardo demasiado. Intentalo de nuevo.',
  SERVER: 'El servidor respondio con un error. Intentalo mas tarde.',
};

export const messageForError = (error) => {
  const hasSpecificApiMessage =
    error?.name === 'ApiError' &&
    typeof error.message === 'string' &&
    error.message !== error.code;

  return hasSpecificApiMessage
    ? error.message
    : ERROR_MESSAGES[error?.code] || 'Ocurrio un error inesperado. Intentalo de nuevo.';
};
