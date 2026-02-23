import mongoose from 'mongoose';

const aporteComprometidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido'],
  },
  monto: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto debe ser mayor o igual a 0'],
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
  pagado: {
    type: Boolean,
    default: true,
  },
  registradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Índice compuesto para búsquedas eficientes
aporteComprometidoSchema.index({ usuario: 1, mes: 1, year: 1 }, { unique: true });

const AporteComprometido = mongoose.model('AporteComprometido', aporteComprometidoSchema);

export default AporteComprometido;
