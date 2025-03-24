import {inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {formatearNombre, getTipo} from "../../utils/stringUtils";

@Injectable({
  providedIn: 'root'
})
export class SriService {

  private baseUrl = environment.apiUrlBase+'sri/';

  http = inject(HttpClient)

  constructor() { }

  getNombres(cedula: string): Observable<string> {
    const tipo = getTipo(cedula);
    return this.http.get(`${this.baseUrl}cliente/${cedula}/${tipo}`, { responseType: 'text' })
      .pipe(
        map(response => {
          const nombres = response.split('|')[0];
          return formatearNombre(nombres.trim())
        })
      );
  }

}
