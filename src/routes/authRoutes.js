import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

// Validaciones
const registerValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido').trim(),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').optional().isIn(['admin', 'comprometido']).withMessage('Rol inválido'),
  body('montoComprometido').optional().isFloat({ min: 0 }).withMessage('Monto inválido'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
];

// Rutas públicas
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);

// Rutas protegidas
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

export default router;
