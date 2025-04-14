import {Component, inject, OnInit} from '@angular/core';
import {CalificacionService} from '../../core/services/calificacion.service';
import {Calificacion} from '../../core/interfaces/calificacion';
import {DatePipe} from "@angular/common";
import {formatearFecha, formatHora} from "../../utils/stringUtils";
import {ChartsComponent} from "../../shared/components/charts/charts.component";
import {FormsModule} from "@angular/forms";
import {converToExcel} from "../../utils/excel-utils";

@Component({
  selector: 'app-listado-calificacion',
  standalone: true,
  imports: [DatePipe, ChartsComponent, FormsModule,],
  templateUrl: './listado-calificacion.component.html',
  styles: `
    .nowrap {
      white-space: nowrap;
    }
  `
})
export default class ListadoCalificacionComponent implements OnInit {

  private calificacionService = inject(CalificacionService)

  calificaciones: Calificacion[] = []
  ratings: any[] = []

  viewChartsDiv = false;
  loading: boolean = false;

  empleadoId: any
  rating: any
  fechaInicio: any
  fechaFin: any

  constructor() {
  }

  ngOnInit(): void {
    this.getCalificaciones()
    this.ratings = [
      {value: 0, label: 'Pésimo'},
      {value: 1, label: 'Malo'},
      {value: 2, label: 'Malo'},
      {value: 3, label: 'Regular'},
      {value: 4, label: 'Regular'},
      {value: 5, label: 'Aceptable'},
      {value: 6, label: 'Aceptable'},
      {value: 7, label: 'Bueno'},
      {value: 8, label: 'Bueno'},
      {value: 9, label: 'Muy Bueno'},
      {value: 10, label: 'Excelente'}
    ];
  }

  getCalificaciones() {
    this.calificacionService.all().subscribe({
      next: data => {
        this.calificaciones = data
      }
    })
  }

  search() {
    this.loading = true;
    const fechaInicio = this.fechaInicio ? this.fechaInicio : null;
    const fechaFin = this.fechaFin ? this.fechaFin : null;
    let empleadoId = this.empleadoId ? this.empleadoId : null;
    const rating = this.rating ? this.rating : null;

    let count = 0
    if (fechaInicio) count++
    if (fechaFin) count++;
    if (empleadoId){
      empleadoId = empleadoId.toUpperCase()
      count++;
    }
    if (rating) count++;
    if (count == 0) {
      this.loading = false;
      alert('campos vacios')
      return;
    }
    this.calificacionService.search(empleadoId, rating, fechaInicio, fechaFin).subscribe({
      next: data => {
        this.calificaciones = data
        this.cleanInputs()
      }
    })
  }

  viewCharts() {
    this.viewChartsDiv = !this.viewChartsDiv;
  }

  cleanInputs() {
    this.fechaInicio = null;
    this.fechaFin = null;
    this.empleadoId = null;
    this.rating = null;
  }

  getLabel() {
    if (this.viewChartsDiv) {
      return 'Ver Tabla'
    } else {
      return 'Ver Grafico'
    }
  }

  exportExcel() {
    const flattenedData = this.calificaciones.map(c => ({
      fecha: c.fecha,
      hora: c.hora,
      cliente: c.cliente.nombre, // Extrae el nombre del cliente
      empleado: c.empleado.nombre, // Extrae el nombre del empleado
      observacion: c.observacion,
      calificacion: c.calificacion,
      rating: c.rating
    }));

    converToExcel(flattenedData, 'Calificaciones');
  }


  protected readonly formatHora = formatHora;
  protected readonly formatearFecha = formatearFecha;
  protected readonly converToExcel = converToExcel;
}
