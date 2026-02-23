import authService from '../services/authService.js';
import { successResponse, errorResponse } from '../helpers/responseHelper.js';

export const register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);
    successResponse(res, { user, token }, 'Usuario registrado exitosamente', 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const { user, token } = await authService.login(email, password);
    successResponse(res, { user, token }, 'Login exitoso');
  } catch (error) {
    errorResponse(res, error.message, 401);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user._id);
    successResponse(res, user, 'Perfil obtenido exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    successResponse(res, user, 'Perfil actualizado exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};
