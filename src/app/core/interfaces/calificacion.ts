import {Cliente} from "./cliente";
import {Empleado} from "./empleado";

export interface Calificacion {
  fecha:        any;
  hora:         any;
  cliente:      Cliente;
  empleado:     Empleado;
  observacion:  string;
  calificacion: string;
  rating:       number;
}
