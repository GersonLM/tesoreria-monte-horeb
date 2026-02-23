import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import tesoreriaRoutes from './tesoreriaRoutes.js';

const router = express.Router();

// Rutas principales
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tesoreria', tesoreriaRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Monte Horeb funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

export default router;
