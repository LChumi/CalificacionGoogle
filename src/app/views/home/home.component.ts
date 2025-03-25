import {EmpleadoService} from '../../core/services/empleado.service';
import {Calificacion} from '../../core/interfaces/calificacion';
import {CalificacionService} from '../../core/services/calificacion.service';
import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {SriService} from "../../core/services/sri.service";
import {Cliente} from "../../core/interfaces/cliente";
import {Empleado} from "../../core/interfaces/empleado";
import {esNombre} from "../../utils/stringUtils";
import {RatingsButtonsComponent} from "../../shared/components/ratings-buttons/ratings-buttons.component";
import {RatingsStarComponent} from "../../shared/components/ratings-star/ratings-star.component";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RatingsButtonsComponent, RatingsStarComponent],
  templateUrl: './home.component.html',
  styles: `
    .bg-text-color-white:focus {
      color: white;
    }

    .bg-text-color-white:active {
      color: white;
    }
  `,
})
export default class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild(RatingsButtonsComponent) ratings!: RatingsButtonsComponent
  @ViewChild(RatingsStarComponent) stars!: RatingsStarComponent

  sriservice = inject(SriService)
  calificacionService = inject(CalificacionService)
  empleadoService = inject(EmpleadoService)
  route = inject(Router)

  cli_nombre= '';
  cli_cedula='';
  imageDir:string ='assets/images/user.png';
  usrId= '';
  emp_nombre = '';
  observacion:string='';
  sugerencia:string='';
  subObservacion: string=''
  rating: number = 0;
  calificacionEnum:string='';
  ventanaPolitica: boolean= false;
  aceptaPoliticas: boolean = false;
  visibleRatingButtons:boolean = false;

  botonBloquear:boolean = false;

  opciones: string[] = [
    'Atención de nuestro personal',
    'Calidad de nuestros productos',
    'Falta de productos',
    'Tiempo de espera',
    'Nuestras Instalaciones'
  ];

  subOpciones: string[] = ['Pasillos', 'Señalización', 'Baños', 'Estacionamiento'];


  constructor() {}

  ngOnInit(): void {
    this.getData()
    setTimeout(() => {
      this.traerImagen()
    },1000)
  }

  goToIndex(){
    this.route.navigate(['/cumple/inicio'])
  }


  logout() {
    this.goToIndex()
  }

  guardarCalificacion(){
    this.botonBloquear=!this.botonBloquear;
    localStorage.setItem("acepta",JSON.stringify(this.aceptaPoliticas))
    this.validateObservationInput()
    const empleado: Empleado = {
      id : this.usrId,
      nombre : this.emp_nombre
    }
    const cliente: Cliente ={
      id : this.cli_cedula,
      nombre: this.cli_nombre,
      aceptaPolicies: this.aceptaPoliticas
    }
    const calificacion : Calificacion = {
      fecha: null,
      hora: null,
      cliente: cliente,
      empleado: empleado,
      observacion: this.observacion,
      calificacion: this.calificacionEnum,
      rating: this.rating,
    }

    this.calificacionService.saveRating(calificacion).subscribe({
      next:(calificacion : Calificacion) => {
        if(calificacion){
          this.goToIndex()
        }
      },error:(error) => {
        console.error(error)
          this.botonBloquear=false;
        }
    }
    )
  }

  mostrarVentana(){
    this.ventanaPolitica = ! this.ventanaPolitica;
  }

  traerImagen(){
    if(/SQUIÑONEZ/.test(this.usrId)){
      this.usrId='SQUINONEZ';
    }
    this.empleadoService.getImagen(this.usrId+'.jpg').subscribe({
      next: data => {
        if(data){
          this.imageDir=URL.createObjectURL(data);
        }
      },
      error: error => {
        console.error(error);
      }
    })
  }


  validarNombre() {
    const isOnlyNumber = /^\d+$/.test(this.cli_nombre);
    if (isOnlyNumber) {
      this.sriservice.getNombres(this.cli_nombre).subscribe({
        next: (nombreCompleto) => {
          if (nombreCompleto) {
            this.cli_nombre = nombreCompleto;
            localStorage.setItem('cliente', this.cli_nombre);
          }
        },
        error: (error) => {
          console.error('Error al obtener el nombre:', error);
        },
      });
    }
  }

  getData(){
    this.cli_cedula= localStorage.getItem('cli_id') ?? '';
    this.cli_nombre= localStorage.getItem('cli_nombre') ?? '';
    this.emp_nombre = sessionStorage.getItem('emp_nombre') ?? '';
    this.usrId= sessionStorage.getItem('emp_id') ?? '';
    const acceptPolicies = localStorage.getItem('acepta');
    if(acceptPolicies !==null){
      this.aceptaPoliticas= true;
    }
    if(this.cli_nombre == '' && this.cli_cedula == ''){
      this.logout()
    }else {
      this.validarNombre()
    }
    if (this.emp_nombre == ''){
      this.logout()
    }
  }

  protected readonly esNombre = esNombre;

  ngAfterViewInit(): void {
    if (this.ratings){
      this.ratings.onChangeRating.subscribe(cal => {
        this.calificacionEnum = cal;
      })
    }
    if (this.stars) {
      this.stars.onChangeRatingStar.subscribe(rating => {
        this.rating = rating;
      });
    } else {
      console.error('El componente o la propiedad onChangeRatingStar no están definidos.');
    }
  }

  onSelectChange() {
    // Resetear la subcategoría si cambia la opción principal
    if (this.observacion !== 'Nuestras Instalaciones') {
      this.subObservacion = '';
    }
  }

  validateObservationInput(){
    if (this.observacion?.trim() && this.sugerencia?.trim()) {
      this.observacion = `${this.observacion} : ${this.sugerencia}`;
    }

    if (this.observacion === 'Nuestras Instalaciones') {
      if (this.subObservacion.trim() !=='' && this.sugerencia?.trim() !==''){
        this.subObservacion = `${this.subObservacion} : ${this.sugerencia}`;
        this.observacion = `Nuestras Instalaciones: ${this.subObservacion}`;
      }
      if (this.sugerencia?.trim() !=='') {
        this.observacion = `Nuestras Instalaciones: ${this.sugerencia}`;
      }
    }
  }
}
