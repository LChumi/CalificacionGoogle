import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import { CalificacionService } from '../../core/services/calificacion.service';
import { Calificacion } from '../../core/interfaces/calificacion';
import {DatePipe, KeyValue} from "@angular/common";
import {formatHora} from "../../utils/stringUtils";
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-listado-calificacion',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './listado-calificacion.component.html',
  styles:`
  .nowrap {
    white-space: nowrap;
  }
  `
})
export default class ListadoCalificacionComponent implements OnInit, AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private calificacionService = inject(CalificacionService)

  chart!: Chart;

  calificaciones:Calificacion[] =[]

  constructor(){}

  ngOnInit(): void {
    this.getCalificaciones()
  }

  ngAfterViewInit(){
    this.initChart()
  }

  initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('No se pudo obtener el contexto del canvas');
      return;
    }

    // Verifica si hay datos
    if (!this.calificaciones || this.calificaciones.length === 0) {
      console.warn('No hay datos para mostrar en el gráfico');
      return;
    }

    // Formatear labels (fechas) y data (ratings)
    const labels = this.calificaciones.map(c => new Date(c.fecha).toLocaleDateString());
    const data = this.calificaciones.map(c => c.rating);

    console.log('Labels:', labels);
    console.log('Data:', data);

    // Crear el gráfico
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Ratings por Fecha',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 10, // Ajustar según la escala de ratings (en tu caso, va de 0 a 10)
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  getCalificaciones() {
    this.calificacionService.all().subscribe({
      next: data => {
        this.calificaciones = data
        this.initChart()
      }
    })
  }

  protected readonly formatHora = formatHora;
}
