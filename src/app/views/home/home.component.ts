import { EmpleadoService } from '../../core/services/empleado.service';
import { Calificacion } from '../../core/interfaces/calificacion';
import { CalificacionService } from '../../core/services/calificacion.service';
import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {SriService} from "../../core/services/sri.service";
import {ClienteService} from "../../core/services/cliente.service";

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
  clienteservice= inject(ClienteService)

  name= localStorage.getItem('cliente') ?? '';
  imageDir?:string ='assets/images/user.png';
  imagen= sessionStorage.getItem('imagen') ?? '';
  empleado = sessionStorage.getItem('empleado') ?? '';
  calificacion?:Calificacion;
  observacion?:string='';
  calificacionEnum?:string='';
  ventanaPolitica: boolean= false;
  aceptaPoliticas: boolean = false;
  isImage:boolean = false;

  botonBloquear:boolean = false;

  constructor(
    private calificacionService: CalificacionService,
    private empleadoService: EmpleadoService,
    private route:Router
  ) {

  }
  ngOnInit(): void {
    this.calificacion= new Calificacion();
    if(this.name == ''){
      this.logout()
    }else {
      this.validarNombre()
    }
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
    console.log(calificacion)
  }

  guardarCalificacion(){
    this.botonBloquear=!this.botonBloquear;
    if(!this.calificacion){
      alert('Por favor agrege una calificacion');
      return;
    }
    const horaActual = new Date();
    this.calificacion.cliente=this.name || 'Usuario';
    this.calificacion.empleado=this.empleado;
    this.calificacion.observacion=this.observacion?.toUpperCase();
    this.calificacion.calificacionEnum=this.calificacionEnum;
    this.calificacion.aceptaPoliticas=this.aceptaPoliticas;
    this.calificacion.hora= horaActual.toLocaleTimeString();
    localStorage.setItem("acepta",JSON.stringify(this.aceptaPoliticas))

    this.calificacionService.guardar(this.calificacion).subscribe({
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
    const aceptaPoliticas = localStorage.getItem('acepta');
    console.log(aceptaPoliticas)
    if(aceptaPoliticas !==null){
      this.aceptaPoliticas= true;
    }
    this.empleado = sessionStorage.getItem('empleado') ?? '';
    this.imagen= sessionStorage.getItem('imagen') ?? '';
    if(/SQUIÑONEZ/.test(this.imagen)){
      this.imagen='SQUINONEZ';
    }
    this.empleadoService.getImagen(this.imagen+'.jpg').subscribe(
      data => {
        if(data){
          const objectUrl = URL.createObjectURL(data);
          this.imageDir=objectUrl;
          sessionStorage.setItem("imagenUrl",String(objectUrl))
        }else{
          console.log('error');
          this.imageDir='assets/images/user.png'
        }
      },
      error => {
        console.log('Error al cargar la imagen:', error);
        this.imageDir = 'assets/images/user.png';
      }
    )
  }

  esNombre(dato:string){
    return isNaN(Number(dato));
  }

  validarNombre() {
    const isOnlyNumber = /^\d+$/.test(this.name);

    if (isOnlyNumber) {
      this.sriservice.getNombres(this.name).subscribe({
        next: (nombreCompleto) => {
          // Si nombreCompleto está vacío, sigue con getCliente
          if (!nombreCompleto) {
            console.warn('Nombre obtenido es vacío, llamando a getCliente.');
          } else {
            this.name = nombreCompleto;
            localStorage.setItem('cliente', this.name);
          }

          // Llama a getCliente independientemente del resultado
          this.clienteservice.getCliente(this.name || String(this.name)).subscribe({
            next: (nombreCompleto) => {
              this.name = nombreCompleto;
              localStorage.setItem('cliente', this.name);
            },
            error: (error) => {
              console.error('Error al obtener el cliente:', error);
            }
          });
        },
        error: (error) => {
          localStorage.setItem('cliente', String(this.name));
          console.error('Error al obtener el nombre:', error);
        },
      });
    }
  }


}
