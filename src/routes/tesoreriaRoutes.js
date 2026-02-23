import express from 'express';
import { body } from 'express-validator';
import * as tesoreriaController from '../controllers/tesoreriaController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Validaciones
const ofrendaValidation = [
  body('monto').isFloat({ min: 0 }).withMessage('El monto debe ser mayor o igual a 0'),
  body('fecha').isISO8601().withMessage('Formato de fecha inválido'),
  body('motivo').optional().trim(),
];

const ventaValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido').trim(),
  body('inversion').optional().isFloat({ min: 0 }).withMessage('La inversión debe ser mayor o igual a 0'),
  body('ganancias').isFloat({ min: 0 }).withMessage('Las ganancias deben ser mayores o iguales a 0'),
  body('descripcion').optional().trim(),
  body('fecha').isISO8601().withMessage('Formato de fecha inválido'),
];

const egresoValidation = [
  body('monto').isFloat({ min: 0 }).withMessage('El monto debe ser mayor o igual a 0'),
  body('motivo').notEmpty().withMessage('El motivo es requerido').trim(),
  body('fecha').isISO8601().withMessage('Formato de fecha inválido'),
];

const aporteValidation = [
  body('usuario').notEmpty().withMessage('El usuario es requerido').isMongoId().withMessage('ID de usuario inválido'),
  body('monto').isFloat({ min: 0 }).withMessage('El monto debe ser mayor o igual a 0'),
  body('fecha').isISO8601().withMessage('Formato de fecha inválido'),
  body('pagado').optional().isBoolean().withMessage('El campo pagado debe ser booleano'),
];

// Resúmenes
router.get('/resumen/:mes/:year', tesoreriaController.getResumenMensual);
router.get('/resumen-anual/:year', tesoreriaController.getResumenAnual);

// Comprometidos - estado
router.get('/comprometidos/:mes/:year', tesoreriaController.getEstadoComprometidos);

// Ofrendas
router.post('/ofrendas', restrictTo('admin'), ofrendaValidation, validateRequest, tesoreriaController.crearOfrenda);
router.put('/ofrendas/:id', restrictTo('admin'), ofrendaValidation, validateRequest, tesoreriaController.actualizarOfrenda);
router.delete('/ofrendas/:id', restrictTo('admin'), tesoreriaController.eliminarOfrenda);

// Ventas
router.post('/ventas', restrictTo('admin'), ventaValidation, validateRequest, tesoreriaController.crearVenta);
router.put('/ventas/:id', restrictTo('admin'), ventaValidation, validateRequest, tesoreriaController.actualizarVenta);
router.delete('/ventas/:id', restrictTo('admin'), tesoreriaController.eliminarVenta);

// Egresos
router.post('/egresos', restrictTo('admin'), egresoValidation, validateRequest, tesoreriaController.crearEgreso);
router.put('/egresos/:id', restrictTo('admin'), egresoValidation, validateRequest, tesoreriaController.actualizarEgreso);
router.delete('/egresos/:id', restrictTo('admin'), tesoreriaController.eliminarEgreso);

// Aportes Comprometidos
router.post('/aportes', restrictTo('admin'), aporteValidation, validateRequest, tesoreriaController.registrarAporteComprometido);
router.put('/aportes/:id', restrictTo('admin'), aporteValidation, validateRequest, tesoreriaController.actualizarAporteComprometido);
router.delete('/aportes/:id', restrictTo('admin'), tesoreriaController.eliminarAporteComprometido);

export default router;
