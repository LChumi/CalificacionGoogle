import {inject, Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Calificacion } from '../interfaces/calificacion';
import { Observable } from 'rxjs';
import {Empleado} from "../interfaces/empleado";

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private baseUrl = environment.apiMongoUrlBase+'ratings';
  private http = inject(HttpClient);

  constructor() { }

  all():Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.baseUrl}/all`);
  }

  allEmployee(empleado:string): Observable<Calificacion[]>{
    return this.http.get<Calificacion[]>(`${this.baseUrl}/all/empleado/${empleado}`);
  }

  saveRating(calificacion: Calificacion): Observable<Calificacion>{
    return this.http.post<Calificacion>(`${this.baseUrl}/save`,calificacion);
  }

  delete(id:string):Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }

  search(empleadoId?: string, rating?: number, fechaInicio?: string, fechaFin?: string): Observable<Calificacion[]> {
    let params = new HttpParams();
    if (empleadoId) params = params.set('empleadoId', empleadoId);
    if (rating) params = params.set('rating', rating);
    if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaFin', fechaFin);
    return this.http.get<Calificacion[]>(`${this.baseUrl}/filter`, {params: params});
  }
}
