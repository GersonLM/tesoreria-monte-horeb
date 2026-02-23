import { verifyToken } from '../helpers/jwt.js';
import User from '../models/User.js';
import { errorResponse } from '../helpers/responseHelper.js';

export const protect = async (req, res, next) => {
  let token;

  // Obtener token del header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar si existe el token
  if (!token) {
    return errorResponse(res, 'No autorizado, token no proporcionado', 401);
  }

  try {
    // Verificar token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return errorResponse(res, 'Token inválido o expirado', 401);
    }

    // Obtener usuario del token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return errorResponse(res, 'Usuario no encontrado', 404);
    }

    if (!user.activo) {
      return errorResponse(res, 'Usuario inactivo', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Error en la autenticación', 401);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return errorResponse(
        res,
        'No tienes permisos para realizar esta acción',
        403
      );
    }
    next();
  };
};
