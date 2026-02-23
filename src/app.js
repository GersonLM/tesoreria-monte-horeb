import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Configurar variables de entorno
dotenv.config({ path: 'variables.env' });

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '🏛️ API Tesorería Monte Horeb',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      tesoreria: '/api/tesoreria',
      health: '/api/health'
    }
  });
});

// Rutas de la API
app.use('/api', routes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🏛️  MONTE HOREB - TESORERÍA API');
  console.log('=================================');
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`📍 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('=================================');
});

export default app;
