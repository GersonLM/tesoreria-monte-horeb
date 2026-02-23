import mongoose from 'mongoose';

const ofrendaSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto debe ser mayor o igual a 0'],
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es requerida'],
  },
  motivo: {
    type: String,
    trim: true,
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
ofrendaSchema.index({ mes: 1, year: 1 });

const Ofrenda = mongoose.model('Ofrenda', ofrendaSchema);

export default Ofrenda;
