import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Cliente } from '../interfaces/cliente';
import {map, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = environment.apiUrlBase+'cliente/';

  constructor(private http:HttpClient) { }

  getCliente(id:any):Observable<string>{
    return this.http.get<Cliente>(this.baseUrl+'buscar/'+id)
      .pipe(
        map(response => {
          return this.formatearNombre(response.cliNombre.trim())
        })
      )
  }

  private formatearNombre(data: string): string {
    const nombres = data.split(' ');
    const nombre = nombres[0]; // Primer nombre
    const segundoNombre = nombres.length > 2 ? nombres[2] : nombres.length > 1 ? nombres[1] : ''; // Segundo nombre
    return segundoNombre ? `${nombre} ${segundoNombre}` : nombre;
  }
}
