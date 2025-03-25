import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import Chart from "chart.js/auto";
import {CalificacionService} from "../../../core/services/calificacion.service";
import {Calificacion} from "../../../core/interfaces/calificacion";

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [],
  templateUrl: './charts.component.html',
  styles: ``
})
export class ChartsComponent implements OnInit, AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasRadar') chartCanvasRadar!: ElementRef<HTMLCanvasElement>;

  private calificaciones:Calificacion[] =[]

  private calificacionService = inject(CalificacionService)
  private chartRadar!: Chart;
  private chartLinea!: Chart;

  ngOnInit(): void {
    this.getCalificaciones()
  }

  ngAfterViewInit(){
    this.initChart()
  }

  getCalificaciones() {
    this.calificacionService.all().subscribe({
      next: data => {
        this.calificaciones = data
        this.initChart()
      }
    })
  }

  initChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const ctxRadar = this.chartCanvasRadar.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('No se pudo obtener el contexto del canvas');
      return;
    }
    if (!ctxRadar) {
      console.warn('No se pudo obtener el contexto del canvas');
      return;
    }

    // Verifica si hay datos
    if (!this.calificaciones || this.calificaciones.length === 0) {
      console.warn('No hay datos para mostrar en el gráfico');
      return;
    }

    const groupedByDate: Record<string, { total: number; count: number }> = {};

    this.calificaciones.forEach(calif => {
      const date = new Date(calif.fecha).toLocaleDateString();
      if (!groupedByDate[date]) groupedByDate[date] = { total: 0, count: 0 };
      groupedByDate[date].total += calif.rating;
      groupedByDate[date].count++;
    });

    const labels = Object.keys(groupedByDate);
    const data = labels.map(date => groupedByDate[date].total / groupedByDate[date].count);

    this.chartLinea = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Promedio de Calificación por Día',
            data: data,
            fill: false,
            backgroundColor: '#60a5fa',
            borderColor: 'blue',
            borderWidth: 2,
            tension: 0.4
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 10, // Ajusta según el rango de calificaciones
          },
        },
      },
    });

    const groupedByEmployee: { [key: string]: { total: number; count: number } } = {};

    this.calificaciones.forEach((calif) => {
      const key = calif.empleado.nombre; // Agrupamos por nombre del empleado

      if (!groupedByEmployee[key]) groupedByEmployee[key] = { total: 0, count: 0 };

      groupedByEmployee[key].total += calif.rating;
      groupedByEmployee[key].count++;
    });

// Extraemos los datos para el gráfico
    const labelsRadar = Object.keys(groupedByEmployee);
    const dataRadar = labelsRadar.map(emp => groupedByEmployee[emp].total / groupedByEmployee[emp].count); // Promedio

    this.chartRadar = new Chart(ctxRadar, {
      type: 'radar',
      data: {
        labels: labelsRadar,
        datasets: [
          {
            label: 'Promedio de Calificación por Empleado',
            data: dataRadar,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            beginAtZero: true,
            max: 10, // Escala sobre 10
          },
        },
      },
    });
  }
}
