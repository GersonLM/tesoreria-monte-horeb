import Ofrenda from '../models/Ofrenda.js';
import Venta from '../models/Venta.js';
import Egreso from '../models/Egreso.js';
import OtroIngreso from '../models/OtroIngreso.js';
import AporteComprometido from '../models/AporteComprometido.js';
import User from '../models/User.js';
import { extractMonthYear } from '../helpers/dateHelper.js';
import { ORGANIZACIONES } from '../consts.js';

class TesoreriaService {
  // Obtener resumen mensual
  async getResumenMensual(mes, year, organizacion = ORGANIZACIONES.MISION) {
    const filtro = { mes, year, organizacion };

    // Obtener todos los ingresos
    const ofrendas = await Ofrenda.find(filtro);
    const ventas = await Venta.find(filtro);
    const otros = await OtroIngreso.find(filtro);
    const aportesComprometidos = organizacion === ORGANIZACIONES.MISION
      ? await AporteComprometido.find({ mes, year, pagado: true }).populate('usuario', 'nombre montoComprometido')
      : [];

    // Calcular totales de ingresos
    const totalOfrendas = ofrendas.reduce((sum, o) => sum + o.monto, 0);
    const totalVentas = ventas.reduce((sum, v) => sum + v.ganancias, 0);
    const totalOtros = otros.reduce((sum, o) => sum + o.monto, 0);
    const totalComprometidos = aportesComprometidos.reduce((sum, a) => sum + a.monto, 0);
    const totalIngresos = totalOfrendas + totalVentas + totalOtros + totalComprometidos;

    // Obtener egresos
    const egresos = await Egreso.find(filtro);
    const totalEgresos = egresos.reduce((sum, e) => sum + e.monto, 0);

    // Calcular balance
    const balance = totalIngresos - totalEgresos;

    return {
      mes,
      year,
      organizacion,
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
        otros: {
          total: totalOtros,
          cantidad: otros.length,
          detalle: otros
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
  async getResumenAnual(year, organizacion = ORGANIZACIONES.MISION) {
    const resumen = [];

    for (let mes = 1; mes <= 12; mes++) {
      const resumenMes = await this.getResumenMensual(mes, year, organizacion);
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

  // Crear otro ingreso
  async crearOtroIngreso(data, userId) {
    const { mes, year } = extractMonthYear(data.fecha);

    const otroIngreso = await OtroIngreso.create({
      ...data,
      mes,
      year,
      registradoPor: userId
    });

    return otroIngreso;
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
    const inicioMes = new Date(year, mes - 1, 1);
    const inicioMesSiguiente = new Date(year, mes, 1);

    const comprometidos = await User.find({
      rol: 'comprometido',
      $and: [
        {
          $or: [
            { activo: true },
            { activo: false, fechaDesactivacion: { $gte: inicioMes } }
          ]
        },
        {
          $or: [
            { fechaInicio: null },
            { fechaInicio: { $exists: false } },
            { fechaInicio: { $lt: inicioMesSiguiente } }
          ]
        }
      ]
    }).select('nombre email montoComprometido activo fechaDesactivacion fechaInicio');

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
            montoComprometido: comprometido.montoComprometido,
            activo: comprometido.activo,
            fechaInicio: comprometido.fechaInicio,
            fechaDesactivacion: comprometido.fechaDesactivacion
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

  async actualizarOtroIngreso(id, data) {
    if (data.fecha) {
      const { mes, year } = extractMonthYear(data.fecha);
      data.mes = mes;
      data.year = year;
    }
    return await OtroIngreso.findByIdAndUpdate(id, data, { new: true, runValidators: true });
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

  async eliminarOtroIngreso(id) {
    return await OtroIngreso.findByIdAndDelete(id);
  }

  async eliminarAporteComprometido(id) {
    return await AporteComprometido.findByIdAndDelete(id);
  }

    // Saldo histórico total acumulado (sin filtro de fecha)
  async getSaldoHistorico(organizacion = ORGANIZACIONES.MISION) {
    const matchOrg = { organizacion };
    const esMision = organizacion === ORGANIZACIONES.MISION;

    const [ofrendas, ventas, otros, aportes, egresos] = await Promise.all([
      Ofrenda.aggregate([{ $match: matchOrg }, { $group: { _id: null, total: { $sum: '$monto' } } }]),
      Venta.aggregate([{ $match: matchOrg }, { $group: { _id: null, total: { $sum: '$ganancias' } } }]),
      OtroIngreso.aggregate([{ $match: matchOrg }, { $group: { _id: null, total: { $sum: '$monto' } } }]),
      esMision
        ? AporteComprometido.aggregate([
            { $match: { pagado: true } },
            { $group: { _id: null, total: { $sum: '$monto' } } }
          ])
        : Promise.resolve([]),
      Egreso.aggregate([{ $match: matchOrg }, { $group: { _id: null, total: { $sum: '$monto' } } }])
    ]);

    const totalOfrendas      = ofrendas[0]?.total  ?? 0;
    const totalVentas        = ventas[0]?.total     ?? 0;
    const totalOtros         = otros[0]?.total      ?? 0;
    const totalComprometidos = aportes[0]?.total    ?? 0;
    const totalIngresos      = totalOfrendas + totalVentas + totalOtros + totalComprometidos;
    const totalEgresos       = egresos[0]?.total    ?? 0;
    const saldoActual        = totalIngresos - totalEgresos;

    const primerRegistro = await Promise.all([
      Ofrenda.findOne(matchOrg).sort({ fecha: 1 }).select('fecha'),
      Venta.findOne(matchOrg).sort({ fecha: 1 }).select('fecha'),
      OtroIngreso.findOne(matchOrg).sort({ fecha: 1 }).select('fecha'),
      esMision
        ? AporteComprometido.findOne({ pagado: true }).sort({ fecha: 1 }).select('fecha')
        : Promise.resolve(null),
      Egreso.findOne(matchOrg).sort({ fecha: 1 }).select('fecha'),
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
        otros: totalOtros,
        comprometidos: totalComprometidos,
      },
      fechaInicio: fechaInicio ? fechaInicio.toISOString() : null,
    };
  }
}

export default new TesoreriaService();
