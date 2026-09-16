import authService from '../services/authService.js';
import { successResponse, errorResponse } from '../helpers/responseHelper.js';

export const register = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    successResponse(res, { user, accessToken, refreshToken }, 'Usuario registrado exitosamente', 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password)
    const { user, accessToken, refreshToken } = await authService.login(email, password);
    successResponse(res, { user, accessToken, refreshToken }, 'Login exitoso');
  } catch (error) {
    errorResponse(res, error.message, 401);
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return errorResponse(res, 'Refresh token no proporcionado', 400);
    }
    const { accessToken } = await authService.refresh(refreshToken);
    successResponse(res, { accessToken }, 'Token renovado exitosamente');
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
