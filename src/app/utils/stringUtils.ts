import {formatDate} from "@angular/common";

export function formatearNombre(data: string): string {
  const nombres = data.split(' ');
  const nombre = nombres[0]; // Primer nombre
  const segundoNombre = nombres.length > 2 ? nombres[2] : nombres.length > 1 ? nombres[1] : ''; // Segundo nombre
  return segundoNombre ? `${nombre} ${segundoNombre}` : nombre;
}

export function getTipo(cedula:string): string {
  let tipo = '';

  if (cedula.length === 10) {
    tipo = 'C';
  } else if (cedula.length === 13) {
    tipo = 'R';
  } else if (/^[A-Za-z0-9]+$/.test(cedula)) { // Verifica si hay letras y números
    tipo = 'P';
  }
  return tipo;
}

export function esNombre(data: string){
  return isNaN(Number(data));
}

export function formatHora(hora: string): string {
  // Eliminar los milisegundos y devolver solo "HH:mm:ss"
  return hora.split('.')[0];
}

export function formatearFecha(fecha : any) {
  // Si la fecha no está vacía y tiene el formato dd/mm/aaaa
  if (fecha && fecha.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    const partes = fecha.split('/');
    // Formatea la fecha al formato yyyy-MM-dd
    fecha = `${partes[2]}-${partes[1]}-${partes[0]}`;
  } else {
    return;
  }
  // Siempre formatea la fecha al formato yyyy-MM-dd después de la verificación
  fecha = formatDate(fecha, 'yyyy-MM-dd', 'en-US');
  return fecha
}

export function getFechaString() {
  const fechaActual = new Date();
  const formatoFecha = fechaActual.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  return formatoFecha.charAt(0).toUpperCase() + formatoFecha.slice(1)
}
