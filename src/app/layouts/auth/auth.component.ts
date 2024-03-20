import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  host:{
    '[attr.auth-component]': 'true'
  }
})
export default class AuthComponent {

}
