import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/userController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Validaciones
const createUserValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido').trim(),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').optional().isIn(['admin', 'comprometido']).withMessage('Rol inválido'),
  body('montoComprometido').optional().isFloat({ min: 0 }).withMessage('Monto inválido'),
];

const updateUserValidation = [
  body('nombre').optional().trim(),
  body('email').optional().isEmail().withMessage('Email inválido').normalizeEmail(),
  body('rol').optional().isIn(['admin', 'comprometido']).withMessage('Rol inválido'),
  body('montoComprometido').optional().isFloat({ min: 0 }).withMessage('Monto inválido'),
];

const updateMontoValidation = [
  body('monto').isFloat({ min: 0 }).withMessage('El monto debe ser mayor o igual a 0'),
];

// Rutas
router.get('/', userController.getAllUsers);
router.get('/comprometidos', userController.getComprometidos);
router.get('/:id', userController.getUserById);

// Solo admin puede crear, actualizar y eliminar usuarios
router.post('/', restrictTo('admin'), createUserValidation, validateRequest, userController.createUser);
router.put('/:id', restrictTo('admin'), updateUserValidation, validateRequest, userController.updateUser);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);
router.put('/:id/monto', restrictTo('admin'), updateMontoValidation, validateRequest, userController.updateMontoComprometido);

export default router;
