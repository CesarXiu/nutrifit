// Función para formatear una fecha a YYYY-MM-DD en la zona horaria local
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Función para obtener el lunes de la semana actual
export const getMondayOfCurrentWeek = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay; // Ajuste para que la semana empiece en lunes
  today.setDate(today.getDate() + diff);
  return today;
};

// Función para obtener un array de fechas de la semana actual
export const getCurrentWeekDates = (): string[] => {
  const monday = getMondayOfCurrentWeek();
  const dates: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(formatLocalDate(date));
  }
  
  return dates;
};

// Función para convertir fecha YYYY-MM-DD a nombre de día
export const getWeekdayName = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase();
};