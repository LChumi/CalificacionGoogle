import { Component } from '@angular/core';
import { AuthGoogleService } from '../../core/services/auth-google.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styles:``
})
export default class HomeComponent {

  name:string='';

  constructor(private authGoogleService: AuthGoogleService){
    setTimeout(() => {
      this.showData()
    },300)
  }

  showData() {
    const data= this.authGoogleService.getProfile();
    this.name = data['name'];
  }

  logout() {
    this.authGoogleService.logout();
  }

}
