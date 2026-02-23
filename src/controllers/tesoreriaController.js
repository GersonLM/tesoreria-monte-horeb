import tesoreriaService from '../services/tesoreriaService.js';
import { successResponse, errorResponse } from '../helpers/responseHelper.js';

// Resumen
export const getResumenMensual = async (req, res) => {
  try {
    const { mes, year } = req.params;
    const resumen = await tesoreriaService.getResumenMensual(parseInt(mes), parseInt(year));
    successResponse(res, resumen, 'Resumen mensual obtenido exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

export const getResumenAnual = async (req, res) => {
  try {
    const { year } = req.params;
    const resumen = await tesoreriaService.getResumenAnual(parseInt(year));
    successResponse(res, resumen, 'Resumen anual obtenido exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

// Ofrendas
export const crearOfrenda = async (req, res) => {
  try {
    const ofrenda = await tesoreriaService.crearOfrenda(req.body, req.user._id);
    successResponse(res, ofrenda, 'Ofrenda creada exitosamente', 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const actualizarOfrenda = async (req, res) => {
  try {
    const ofrenda = await tesoreriaService.actualizarOfrenda(req.params.id, req.body);
    if (!ofrenda) {
      return errorResponse(res, 'Ofrenda no encontrada', 404);
    }
    successResponse(res, ofrenda, 'Ofrenda actualizada exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const eliminarOfrenda = async (req, res) => {
  try {
    const ofrenda = await tesoreriaService.eliminarOfrenda(req.params.id);
    if (!ofrenda) {
      return errorResponse(res, 'Ofrenda no encontrada', 404);
    }
    successResponse(res, null, 'Ofrenda eliminada exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

// Ventas
export const crearVenta = async (req, res) => {
  try {
    const venta = await tesoreriaService.crearVenta(req.body, req.user._id);
    successResponse(res, venta, 'Venta creada exitosamente', 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const actualizarVenta = async (req, res) => {
  try {
    const venta = await tesoreriaService.actualizarVenta(req.params.id, req.body);
    if (!venta) {
      return errorResponse(res, 'Venta no encontrada', 404);
    }
    successResponse(res, venta, 'Venta actualizada exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const eliminarVenta = async (req, res) => {
  try {
    const venta = await tesoreriaService.eliminarVenta(req.params.id);
    if (!venta) {
      return errorResponse(res, 'Venta no encontrada', 404);
    }
    successResponse(res, null, 'Venta eliminada exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

// Egresos
export const crearEgreso = async (req, res) => {
  try {
    const egreso = await tesoreriaService.crearEgreso(req.body, req.user._id);
    successResponse(res, egreso, 'Egreso creado exitosamente', 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const actualizarEgreso = async (req, res) => {
  try {
    const egreso = await tesoreriaService.actualizarEgreso(req.params.id, req.body);
    if (!egreso) {
      return errorResponse(res, 'Egreso no encontrado', 404);
    }
    successResponse(res, egreso, 'Egreso actualizado exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const eliminarEgreso = async (req, res) => {
  try {
    const egreso = await tesoreriaService.eliminarEgreso(req.params.id);
    if (!egreso) {
      return errorResponse(res, 'Egreso no encontrado', 404);
    }
    successResponse(res, null, 'Egreso eliminado exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

// Aportes Comprometidos
export const registrarAporteComprometido = async (req, res) => {
  try {
    const aporte = await tesoreriaService.registrarAporteComprometido(req.body, req.user._id);
    successResponse(res, aporte, 'Aporte registrado exitosamente', 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const actualizarAporteComprometido = async (req, res) => {
  try {
    const aporte = await tesoreriaService.actualizarAporteComprometido(req.params.id, req.body);
    if (!aporte) {
      return errorResponse(res, 'Aporte no encontrado', 404);
    }
    successResponse(res, aporte, 'Aporte actualizado exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const eliminarAporteComprometido = async (req, res) => {
  try {
    const aporte = await tesoreriaService.eliminarAporteComprometido(req.params.id);
    if (!aporte) {
      return errorResponse(res, 'Aporte no encontrado', 404);
    }
    successResponse(res, null, 'Aporte eliminado exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

export const getEstadoComprometidos = async (req, res) => {
  try {
    const { mes, year } = req.params;
    const estado = await tesoreriaService.getEstadoComprometidos(parseInt(mes), parseInt(year));
    successResponse(res, estado, 'Estado de comprometidos obtenido exitosamente');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};
