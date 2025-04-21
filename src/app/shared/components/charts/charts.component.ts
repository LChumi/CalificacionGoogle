import {AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import Chart from "chart.js/auto";
import {CalificacionService} from "../../../core/services/calificacion.service";
import {Calificacion} from "../../../core/interfaces/calificacion";
import {NgClass, TitleCasePipe} from "@angular/common";
import {getFechaString} from "../../../utils/stringUtils";

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    TitleCasePipe,
    NgClass
  ],
  templateUrl: './charts.component.html',
  styles: ``
})
export class ChartsComponent implements OnInit, AfterViewInit {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasRadar') chartCanvasRadar!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCanvasNps') chartCanvasNps!: ElementRef<HTMLCanvasElement>;

  private calificaciones:Calificacion[] =[]

  private calificacionService = inject(CalificacionService)
  private chartRadar!: Chart;
  private chartLinea!: Chart;
  private chartNps!: Chart;

  empleadoVotos: string=''
  votos!: number
  npsValue!: string
  totalVotos!: number
  fecha!: string

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
    const ctxNps = this.chartCanvasNps.nativeElement.getContext('2d');

    if (!ctx) {
      console.warn('No se pudo obtener el contexto del canvas');
      return;
    }
    if (!ctxRadar) {
      console.warn('No se pudo obtener el contexto del canvas');
      return;
    }
    if (!ctxNps) {
      console.warn('No se pudo obtener el contexto del canvas');
      return;
    }

    // Verifica si hay datos
    if (!this.calificaciones || this.calificaciones.length === 0) {
      console.warn('No hay datos para mostrar en el gráfico');
      return;
    }

    //TODO grafico de conteo calificaciones
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

    //TODO grafico de empleados con mas votos
    const groupedByEmployee: { [key: string]: { total: number; count: number } } = {};

    // Agrupar por empleado y contar votos
    this.calificaciones.forEach((calif) => {
      const key = calif.empleado.nombre;

      if (!groupedByEmployee[key]) groupedByEmployee[key] = { total: 0, count: 0 };

      groupedByEmployee[key].total += calif.rating;
      groupedByEmployee[key].count++;
    });

    // Obtener empleados ordenados por cantidad de votos
    const sortedEmployees = Object.entries(groupedByEmployee)
      .sort((a, b) => b[1].count - a[1].count); // Ordenamos por votos (mayor a menor)

    // Extraer datos para el gráfico
    const labelsRadar = sortedEmployees.map(emp => emp[0]); // Nombre del empleado
    const dataRadar = sortedEmployees.map(emp => emp[1].count); // Cantidad de votos

    this.empleadoVotos =sortedEmployees[0][0]
    this.votos = sortedEmployees[0][1].count

    this.chartRadar = new Chart(ctxRadar, {
      type: 'radar',
      data: {
        labels: labelsRadar,
        datasets: [
          {
            label: 'Calificaciones por Empleados',
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
          },
        },
      },
    });

    //TODO grafico NPS
    const ratingsCount: { [key: number]: number } = {};

    // Inicializamos todos los ratings del 1 al 10 en 0
    for (let i = 1; i <= 10; i++) {
      ratingsCount[i] = 0;  // Inicializa correctamente
    }

    // Contamos cuántas veces aparece cada rating
    this.calificaciones.forEach((calif) => {
      const rating = calif.rating;
      if (rating >= 1 && rating <= 10) {
        ratingsCount[rating] = (ratingsCount[rating] || 0) + 1;
      }
    });

    // Extraemos los datos para el gráfico
    const labelsBar = Object.keys(ratingsCount).map(Number); // Ratings del 1 al 10
    const dataBar = Object.values(ratingsCount); // Cantidad de votos por rating

    const totalVotos = Object.values(ratingsCount)
      .reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    const votos9 = ratingsCount[9] || 0;
    const votos10 = ratingsCount[10] || 0;

    const nps = totalVotos > 0 ? ((votos9 + votos10) / totalVotos) * 100 : 0;
    this.totalVotos = totalVotos
    this.npsValue = nps.toFixed(2);

    console.log("NPS:", this.npsValue + "%");


    this.npsValue = nps.toFixed(2); // Se deja con dos decimales

    console.log("NPS:", this.npsValue + "%");


    this.chartNps = new Chart(ctxNps, {
      type: "bar",
      data: {
        labels: labelsBar,
        datasets: [
          {
            label: 'Calificaciones',
            data: dataBar,
            backgroundColor: '#60a5fa',
            borderColor: 'blue',
            borderWidth: 2,
          },
        ],
      },
    })
  }

  protected readonly getFechaString = getFechaString;
  protected readonly Number = Number;
}
