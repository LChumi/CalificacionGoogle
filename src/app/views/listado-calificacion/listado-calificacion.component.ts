import { Component, OnInit } from '@angular/core';
import { CalificacionService } from '../../core/services/calificacion.service';
import { Calificacion } from '../../core/interfaces/calificacion';

@Component({
  selector: 'app-listado-calificacion',
  standalone: true,
  imports: [],
  templateUrl: './listado-calificacion.component.html',
  styles:``
})
export default class ListadoCalificacionComponent implements OnInit{

  calificaciones:Calificacion[] =[]
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
