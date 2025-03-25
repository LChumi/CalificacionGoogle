import { Component, inject, OnInit} from '@angular/core';
import { CalificacionService } from '../../core/services/calificacion.service';
import { Calificacion } from '../../core/interfaces/calificacion';
import {DatePipe} from "@angular/common";
import {formatHora} from "../../utils/stringUtils";
import {ChartsComponent} from "../../shared/components/charts/charts.component";

@Component({
  selector: 'app-listado-calificacion',
  standalone: true,
  imports: [DatePipe, ChartsComponent,],
  templateUrl: './listado-calificacion.component.html',
  styles:`
  .nowrap {
    white-space: nowrap;
  }
  `
})
export default class ListadoCalificacionComponent implements OnInit {

  private calificacionService = inject(CalificacionService)

  calificaciones:Calificacion[] =[]

  viewChartsDiv = false;

  constructor(){}

  ngOnInit(): void {
    this.getCalificaciones()
  }

  getCalificaciones() {
    this.calificacionService.all().subscribe({
      next: data => {
        this.calificaciones = data
      }
    })
  }

  viewCharts() {
    this.viewChartsDiv = !this.viewChartsDiv;
  }

  protected readonly formatHora = formatHora;
}
