/**
 * Script de migración: asigna organizacion: 'mision' a los registros
 * existentes de Ofrenda, Venta y Egreso que no tengan ese campo.
 *
 * Uso: node src/scripts/backfillOrganizacion.js
 * (ejecutar desde la carpeta backend/, con variables.env configurado)
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ofrenda from '../models/Ofrenda.js';
import Venta from '../models/Venta.js';
import Egreso from '../models/Egreso.js';

dotenv.config({ path: 'variables.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`Conectado a: ${mongoose.connection.name}`);

  const filtro = { organizacion: { $exists: false } };

  const resultados = await Promise.all([
    Ofrenda.updateMany(filtro, { $set: { organizacion: 'mision' } }),
    Venta.updateMany(filtro, { $set: { organizacion: 'mision' } }),
    Egreso.updateMany(filtro, { $set: { organizacion: 'mision' } }),
  ]);

  const [ofrendas, ventas, egresos] = resultados;
  console.log(`Ofrendas actualizadas: ${ofrendas.modifiedCount}`);
  console.log(`Ventas actualizadas: ${ventas.modifiedCount}`);
  console.log(`Egresos actualizados: ${egresos.modifiedCount}`);

  await mongoose.disconnect();
  console.log('Listo.');
};

run().catch((err) => {
  console.error('Error en la migración:', err);
  process.exit(1);
});
