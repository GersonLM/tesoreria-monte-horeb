import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  inversion: {
    type: Number,
    default: 0,
    min: [0, 'La inversión debe ser mayor o igual a 0'],
  },
  ganancias: {
    type: Number,
    required: [true, 'Las ganancias son requeridas'],
    min: [0, 'Las ganancias deben ser mayores o iguales a 0'],
  },
  descripcion: {
    type: String,
    trim: true,
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es requerida'],
  },
  mes: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  registradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Índice para búsquedas eficientes
ventaSchema.index({ mes: 1, year: 1 });

const Venta = mongoose.model('Venta', ventaSchema);

export default Venta;
