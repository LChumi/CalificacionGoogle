import { Component, OnInit } from '@angular/core';
import { CalificacionService } from '../../core/services/calificacion.service';
import { Calificacion } from '../../core/interfaces/calificacion';
import {KeyValue} from "@angular/common";

@Component({
  selector: 'app-listado-calificacion',
  standalone: true,
  imports: [],
  templateUrl: './listado-calificacion.component.html',
  styles:`
  .nowrap {
    white-space: nowrap;
  }
  `
})
export default class ListadoCalificacionComponent implements OnInit{

  calificaciones:                   Calificacion[] =[]
  conteoCalificacionPorEmpleado:    KeyValue<string, number>[] =[]
  empleadosConExcelente:            {empleado:string , cantidad:number}[] =[]

  mostrarConteo=false;
  mostrarExcelentes =false;

  constructor(private calificacionService:CalificacionService){}

  ngOnInit(): void {
  }





}
