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
    this.listarCalificaciones();
  }


  listarCalificaciones(): void {
    this.calificacionService.getCalificacion().subscribe(
      (lista:Calificacion[]) => {
        this.calificaciones=lista;
      }
    )
  }

  contarCalificaiconesPorEmpleado(){
    this.mostrarConteo= !this.mostrarConteo
    const contador: {[empleado:string]:number} ={};
    for (const calificacion of this.calificaciones){
      const empleado = calificacion.empleado || 'Colaborador';
      contador[empleado]= (contador[empleado] || 0)+1;
    }

    this.conteoCalificacionPorEmpleado = Object.entries(contador).map(([key, value]) => ({key, value}));
  }

  encontrarExcelentes() {
    this.mostrarExcelentes=!this.mostrarExcelentes
    const excelentes: {empleado:string, cantidad:number}[] =[];

    for (const calificacion of this.calificaciones){
      if (calificacion.calificacionEnum === 'EXCELENTE'){
        const empleado = calificacion.empleado || 'Colaborador';
        const existente = excelentes.find(e => e.empleado === empleado);
        if (existente) {
          existente.cantidad++;
        }else {
          excelentes.push({empleado,cantidad:1});
        }
      }
    }
    this.empleadosConExcelente=excelentes
  }

  descargarExcel(){
    this.calificacionService.descargarExcel().subscribe(
      (excelBlob: Blob) => {
        const url= window.URL.createObjectURL(excelBlob);
        // Crear un enlace temporal para descargar el archivo
        const a = document.createElement('a');
        a.href = url;
        a.download='calificaciones.xlsx';
        a.click();

        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error(error)
      }
    )
  }



}
