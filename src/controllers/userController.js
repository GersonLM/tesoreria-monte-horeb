import userService from '../services/userService.js';
import { successResponse, errorResponse } from '../helpers/responseHelper.js';

export const getAllUsers = async (req, res) => {
  try {
    const { rol } = req.query;
    const filters = rol ? { rol } : {};
    const users = await userService.getAllUsers(filters);
    successResponse(res, users, 'Usuarios obtenidos exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    successResponse(res, user, 'Usuario obtenido exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

export const createUser = async (req, res) => {
  try {
    console.log(req.body)
    const user = await userService.createUser(req.body);
    successResponse(res, user, 'Usuario creado exitosamente', 201);
  } catch (error) {
    console.log(error)
    errorResponse(res, error.message, 400);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    successResponse(res, user, 'Usuario actualizado exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    successResponse(res, user, 'Usuario eliminado exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 404);
  }
};

export const getComprometidos = async (req, res) => {
  try {
    const comprometidos = await userService.getComprometidos();
    successResponse(res, comprometidos, 'Comprometidos obtenidos exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

export const updateMontoComprometido = async (req, res) => {
  try {
    const { monto } = req.body;
    const user = await userService.updateMontoComprometido(req.params.id, monto);
    successResponse(res, user, 'Monto actualizado exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};
