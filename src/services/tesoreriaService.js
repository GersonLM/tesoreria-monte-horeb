import Ofrenda from '../models/Ofrenda.js';
import Venta from '../models/Venta.js';
import Egreso from '../models/Egreso.js';
import AporteComprometido from '../models/AporteComprometido.js';
import User from '../models/User.js';
import { extractMonthYear } from '../helpers/dateHelper.js';

class TesoreriaService {
  // Obtener resumen mensual
  async getResumenMensual(mes, year) {
    // Obtener todos los ingresos
    const ofrendas = await Ofrenda.find({ mes, year });
    const ventas = await Venta.find({ mes, year });
    const aportesComprometidos = await AporteComprometido.find({ mes, year, pagado: true })
      .populate('usuario', 'nombre montoComprometido');
    
    // Calcular totales de ingresos
    const totalOfrendas = ofrendas.reduce((sum, o) => sum + o.monto, 0);
    const totalVentas = ventas.reduce((sum, v) => sum + v.ganancias, 0);
    const totalComprometidos = aportesComprometidos.reduce((sum, a) => sum + a.monto, 0);
    const totalIngresos = totalOfrendas + totalVentas + totalComprometidos;

    // Obtener egresos
    const egresos = await Egreso.find({ mes, year });
    const totalEgresos = egresos.reduce((sum, e) => sum + e.monto, 0);

    // Calcular balance
    const balance = totalIngresos - totalEgresos;

    return {
      mes,
      year,
      ingresos: {
        ofrendas: {
          total: totalOfrendas,
          cantidad: ofrendas.length,
          detalle: ofrendas
        },
        ventas: {
          total: totalVentas,
          cantidad: ventas.length,
          detalle: ventas
        },
        comprometidos: {
          total: totalComprometidos,
          cantidad: aportesComprometidos.length,
          detalle: aportesComprometidos
        },
        total: totalIngresos
      },
      egresos: {
        total: totalEgresos,
        cantidad: egresos.length,
        detalle: egresos
      },
      balance
    };
  }

  // Obtener resumen anual
  async getResumenAnual(year) {
    const resumen = [];
    
    for (let mes = 1; mes <= 12; mes++) {
      const resumenMes = await this.getResumenMensual(mes, year);
      resumen.push({
        mes,
        year,
        totalIngresos: resumenMes.ingresos.total,
        totalEgresos: resumenMes.egresos.total,
        balance: resumenMes.balance
      });
    }

    return resumen;
  }

  // Crear ofrenda
  async crearOfrenda(data, userId) {
    const { mes, year } = extractMonthYear(data.fecha);
    
    const ofrenda = await Ofrenda.create({
      ...data,
      mes,
      year,
      registradoPor: userId
    });

    return ofrenda;
  }

  // Crear venta
  async crearVenta(data, userId) {
    const { mes, year } = extractMonthYear(data.fecha);
    
    const venta = await Venta.create({
      ...data,
      mes,
      year,
      registradoPor: userId
    });

    return venta;
  }

  // Crear egreso
  async crearEgreso(data, userId) {
    const { mes, year } = extractMonthYear(data.fecha);
    
    const egreso = await Egreso.create({
      ...data,
      mes,
      year,
      registradoPor: userId
    });

    return egreso;
  }

  // Registrar aporte de comprometido
  async registrarAporteComprometido(data, userId) {
    const { mes, year } = extractMonthYear(data.fecha);
    
    // Verificar que el usuario sea comprometido
    const usuario = await User.findById(data.usuario);
    if (!usuario || usuario.rol !== 'comprometido') {
      throw new Error('El usuario no es un comprometido');
    }

    // Verificar si ya existe un aporte para este mes
    const aporteExistente = await AporteComprometido.findOne({
      usuario: data.usuario,
      mes,
      year
    });

    if (aporteExistente) {
      throw new Error('Ya existe un aporte registrado para este mes');
    }

    const aporte = await AporteComprometido.create({
      ...data,
      mes,
      year,
      registradoPor: userId
    });

    return await aporte.populate('usuario', 'nombre montoComprometido');
  }

  // Obtener estado de comprometidos en un mes
  async getEstadoComprometidos(mes, year) {
    const comprometidos = await User.find({
      rol: 'comprometido',
      activo: true
    }).select('nombre email montoComprometido');

    const estadoComprometidos = await Promise.all(
      comprometidos.map(async (comprometido) => {
        const aporte = await AporteComprometido.findOne({
          usuario: comprometido._id,
          mes,
          year
        });

        return {
          usuario: {
            _id: comprometido._id,
            nombre: comprometido.nombre,
            email: comprometido.email,
            montoComprometido: comprometido.montoComprometido
          },
          pagado: aporte ? aporte.pagado : false,
          montoPagado: aporte ? aporte.monto : 0,
          fechaPago: aporte ? aporte.fecha : null,
          aporteId: aporte ? aporte._id : null
        };
      })
    );

    const totalEsperado = comprometidos.reduce((sum, c) => sum + c.montoComprometido, 0);
    const totalPagado = estadoComprometidos
      .filter(e => e.pagado)
      .reduce((sum, e) => sum + e.montoPagado, 0);

    return {
      mes,
      year,
      comprometidos: estadoComprometidos,
      resumen: {
        totalComprometidos: comprometidos.length,
        totalEsperado,
        totalPagado,
        pendiente: totalEsperado - totalPagado,
        porcentajeCumplimiento: totalEsperado > 0 ? (totalPagado / totalEsperado * 100).toFixed(2) : 0
      }
    };
  }

  // Actualizar registros
  async actualizarOfrenda(id, data) {
    if (data.fecha) {
      const { mes, year } = extractMonthYear(data.fecha);
      data.mes = mes;
      data.year = year;
    }
    return await Ofrenda.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async actualizarVenta(id, data) {
    if (data.fecha) {
      const { mes, year } = extractMonthYear(data.fecha);
      data.mes = mes;
      data.year = year;
    }
    return await Venta.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async actualizarEgreso(id, data) {
    if (data.fecha) {
      const { mes, year } = extractMonthYear(data.fecha);
      data.mes = mes;
      data.year = year;
    }
    return await Egreso.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async actualizarAporteComprometido(id, data) {
    if (data.fecha) {
      const { mes, year } = extractMonthYear(data.fecha);
      data.mes = mes;
      data.year = year;
    }
    const aporte = await AporteComprometido.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('usuario', 'nombre montoComprometido');

    return aporte;
  }

  // Eliminar registros
  async eliminarOfrenda(id) {
    return await Ofrenda.findByIdAndDelete(id);
  }

  async eliminarVenta(id) {
    return await Venta.findByIdAndDelete(id);
  }

  async eliminarEgreso(id) {
    return await Egreso.findByIdAndDelete(id);
  }

  async eliminarAporteComprometido(id) {
    return await AporteComprometido.findByIdAndDelete(id);
  }

    // Saldo histórico total acumulado (sin filtro de fecha)
  async getSaldoHistorico() {
    const [ofrendas, ventas, aportes, egresos] = await Promise.all([
      Ofrenda.aggregate([{ $group: { _id: null, total: { $sum: '$monto' } } }]),
      Venta.aggregate([{ $group: { _id: null, total: { $sum: '$ganancias' } } }]),
      AporteComprometido.aggregate([
        { $match: { pagado: true } },
        { $group: { _id: null, total: { $sum: '$monto' } } }
      ]),
      Egreso.aggregate([{ $group: { _id: null, total: { $sum: '$monto' } } }])
    ]);

    const totalOfrendas      = ofrendas[0]?.total  ?? 0;
    const totalVentas        = ventas[0]?.total     ?? 0;
    const totalComprometidos = aportes[0]?.total    ?? 0;
    const totalIngresos      = totalOfrendas + totalVentas + totalComprometidos;
    const totalEgresos       = egresos[0]?.total    ?? 0;
    const saldoActual        = totalIngresos - totalEgresos;

    const primerRegistro = await Promise.all([
      Ofrenda.findOne().sort({ fecha: 1 }).select('fecha'),
      Venta.findOne().sort({ fecha: 1 }).select('fecha'),
      AporteComprometido.findOne({ pagado: true }).sort({ fecha: 1 }).select('fecha'),
      Egreso.findOne().sort({ fecha: 1 }).select('fecha'),
    ]);

    const fechas = primerRegistro
      .filter(Boolean)
      .map(r => new Date(r.fecha))
      .filter(d => !isNaN(d));

    const fechaInicio = fechas.length
      ? fechas.reduce((a, b) => (a < b ? a : b))
      : null;

    return {
      saldoActual,
      totalIngresos,
      totalEgresos,
      desglose: {
        ofrendas: totalOfrendas,
        ventas: totalVentas,
        comprometidos: totalComprometidos,
      },
      fechaInicio: fechaInicio ? fechaInicio.toISOString() : null,
    };
  }
}

export default new TesoreriaService();
