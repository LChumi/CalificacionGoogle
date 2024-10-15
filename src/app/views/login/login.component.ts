import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../../core/services/empleado.service';
import { Usuario } from '../../core/interfaces/usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SriService} from "../../core/services/sri.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent implements OnInit {
  idEmpleado: any;
  cedula!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private empleadoService: EmpleadoService,
    private sriservice:SriService
  ) {
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idEmpleado = params.get('id');
    });
    this.obtenerEmpleado(this.idEmpleado);
    if(localStorage.getItem('cliente')){
      this.router.navigate(['cumple/home']);
    }
  }

  login() {
    if (!this.cedula) {
      alert('Ingrese su número de cédula');
      return;
  }

  // Verificar longitud
  if (this.cedula.length !== 10 && this.cedula.length !== 13) {
      alert('Ingrese su número de cédula');
      return;
  }

  // Verificar que todos los caracteres sean dígitos
  if (!/^\d+$/.test(this.cedula)) {
      alert('El número de cédula solo puede contener dígitos');
      return;
  }
    this.obtenerCliente(this.cedula);
  }

  obtenerEmpleado(id: any) {
    this.empleadoService.getUsuario(id).subscribe({
      next: (usuario: Usuario) => {
        if (usuario) {
          sessionStorage.setItem('imagen', String(usuario.usr_id));
          const nombres = usuario.usr_nombre.split(' ');
          const nombre = nombres[0]; // Primer nombre
          const segundoNombre =
            nombres.length > 2
              ? nombres[2]
              : nombres.length > 1
              ? nombres[1]
              : ''; // Segundo nombre, si existe
          sessionStorage.setItem(
            'empleado',
            nombre + (segundoNombre ? ' ' + segundoNombre : '')
          );
        }
      },
    });
  }

  obtenerCliente(id: any) {
    this.sriservice.getNombres(id).subscribe({
      next: (data) => {
        if(data){
          const nombres = data.split(' ');
          const nombre = nombres[0]; // Primer nombre
          const segundoNombre =
            nombres.length > 2
              ? nombres[2]
              : nombres.length > 1
              ? nombres[1]
              : ''; // Segundo nombre, si existe
        const nombreCompleto = segundoNombre ? `${nombre} ${segundoNombre}` : nombre;
        console.log(nombreCompleto)
        localStorage.setItem('cliente', nombreCompleto);
        this.router.navigate(['cumple/home']);
        }else{
          localStorage.setItem('cliente', String(id));
        this.router.navigate(['cumple/home']);
        }
      },
      error: (error) => {
        localStorage.setItem('cliente', String(id));
        this.router.navigate(['cumple/home']);
        console.error('Error al obtener el cliente:', error);
      },
    });
  }

}
