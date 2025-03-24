import {EmpleadoService} from '../../core/services/empleado.service';
import {Calificacion} from '../../core/interfaces/calificacion';
import {CalificacionService} from '../../core/services/calificacion.service';
import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {SriService} from "../../core/services/sri.service";
import {Cliente} from "../../core/interfaces/cliente";
import {Empleado} from "../../core/interfaces/empleado";
import {esNombre} from "../../utils/stringUtils";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
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
export default class HomeComponent implements OnInit{

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
  rating: number = 0;
  calificacionEnum:string='';
  ventanaPolitica: boolean= false;
  aceptaPoliticas: boolean = false;
  isImage:boolean = false;

  botonBloquear:boolean = false;

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

  selecionarCalificacion(calificacion: string) {
    this.calificacionEnum=calificacion;
  }

  guardarCalificacion(){
    if(!this.calificacionEnum){
      alert('Por favor, seleccione una calificación');
      return;
    }
    this.botonBloquear=!this.botonBloquear;
    localStorage.setItem("acepta",JSON.stringify(this.aceptaPoliticas))
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
  }

  protected readonly esNombre = esNombre;
}
