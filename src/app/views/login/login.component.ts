import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadoService } from '../../core/services/empleado.service';
import { Usuario } from '../../core/interfaces/usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SriService} from "../../core/services/sri.service";
import {formatearNombre} from "../../utils/stringUtils";

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
    if(localStorage.getItem('cli_nombre')){
      this.router.navigate(['cumple/home']).then(r => {});
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
          sessionStorage.setItem('emp_id', String(usuario.usr_id));
          const nombre = formatearNombre(usuario.usr_nombre)
          sessionStorage.setItem('emp_nombre', nombre);
        }
      },
    });
  }

  obtenerCliente(id: any) {
    this.sriservice.getNombres(id).subscribe({
      next: (nombreCompleto) => {
        localStorage.setItem('cli_nombre', nombreCompleto || String(id));
        localStorage.setItem('cli_id', id);
        this.router.navigate(['cumple/home']).then(r => {});
      },
      error: (error) => {
        localStorage.setItem('cliente', String(id));
        console.error('Error al obtener el cliente:', error);
        this.router.navigate(['cumple/home']).then(r => {});
      },
    });
  }

}
