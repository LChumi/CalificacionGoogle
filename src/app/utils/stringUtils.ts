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
