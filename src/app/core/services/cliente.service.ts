import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Cliente } from '../interfaces/cliente';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = environment.apiUrlBase+'cliente/';

  constructor(private http:HttpClient) { }

  getCliente(id:any):Observable<Cliente>{
    return this.http.get<Cliente>(this.baseUrl+'buscar/'+id)
  }
}
