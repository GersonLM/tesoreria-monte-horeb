import mongoose from 'mongoose';

const otroIngresoSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto debe ser mayor o igual a 0'],
  },
  motivo: {
    type: String,
    required: [true, 'El motivo es requerido'],
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
  organizacion: {
    type: String,
    enum: ['mision', 'edc'],
    default: 'mision',
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
otroIngresoSchema.index({ organizacion: 1, mes: 1, year: 1 });

const OtroIngreso = mongoose.model('OtroIngreso', otroIngresoSchema);

export default OtroIngreso;
