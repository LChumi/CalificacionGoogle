import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Calificacion } from '../interfaces/calificacion';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private baseUrl=environment.apiUrlBase+'usuarios/'

  constructor(private http: HttpClient) { }

  getUsuario(userId : any):Observable<Usuario>{
    return this.http.get<Usuario>(`${this.baseUrl}id/${userId}`);
  }

  getImagen(imagen:any):Observable<Blob>{
    return this.http.get(this.baseUrl+'imagen/'+imagen,{responseType: 'blob'});
  }
}
