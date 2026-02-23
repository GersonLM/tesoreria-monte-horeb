export const extractMonthYear = (date) => {
  // Si la fecha viene como string "YYYY-MM-DD" (sin hora), procesarla directamente
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month] = date.split('-').map(Number);
    return {
      mes: month,
      year: year,
    };
  }
  
  // Para fechas con hora, usar UTC para evitar problemas de zona horaria
  const d = new Date(date);
  return {
    mes: d.getUTCMonth() + 1,
    year: d.getUTCFullYear(),
  };
};

export const getCurrentMonth = () => {
  return new Date().getMonth() + 1;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};

export const getMonthName = (monthNumber) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthNumber - 1] || '';
};

export const isValidMonth = (month) => {
  return month >= 1 && month <= 12;
};

export const isValidYear = (year) => {
  const currentYear = getCurrentYear();
  return year >= 2020 && year <= currentYear + 5;
};
