import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../../core/services/auth-google.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit {

  idEmpleado:any;

  constructor(private authGoogleService: AuthGoogleService, private route: ActivatedRoute){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idEmpleado = params.get('id');
      console.log(this.idEmpleado);
      sessionStorage.setItem("idEmpleado",String(this.idEmpleado))
    })
  }

  login(){
    this.authGoogleService.login();
  }

}
