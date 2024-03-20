import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Calificacion } from '../interfaces/calificacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private baseUrl = environment.apiUrlBase+'calificacion/';

  constructor(private http:HttpClient) { }

  guardar(calificacion: Calificacion):Observable<Calificacion>{
    return this.http.post<Calificacion>(this.baseUrl+"guardar",calificacion)
  }

  getCalificacion():Observable<Calificacion[]>{
    return this.http.get<Calificacion[]>(`${this.baseUrl}listar`)
  }

  descargarExcel():Observable<Blob>{
    return this.http.get(this.baseUrl+'exportar/excel',{responseType:'blob'});
  }
}
