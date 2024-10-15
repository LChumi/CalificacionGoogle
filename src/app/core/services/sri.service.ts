import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SriService {

  private baseUrl = environment.apiUrlBase+'sri/';

  http = inject(HttpClient)

  constructor() { }

  getNombres(cedula: string): Observable<string> {
    let tipo = '';

    if (cedula.length === 10) {
      tipo = 'C';
    } else if (cedula.length === 13) {
      tipo = 'R';
    } else if (/^[A-Za-z0-9]+$/.test(cedula)) { // Verifica si hay letras y números
      tipo = 'P';
    }

    return this.http.get(`${this.baseUrl}ced-ruc/${cedula}/${tipo}`, { responseType: 'text' })
      .pipe(
        map(response => {
          const nombres = response.split('|')[0]; // Obtiene la parte antes del '|'
          return nombres.trim(); // Elimina espacios en blanco
        })
      );
  }


}
