import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  standalone: true,
  imports: [RouterLink,FooterComponent],
  templateUrl: './index.component.html',
  styles: ``
})
export default class IndexComponent implements OnInit{

  iconoVisible:boolean=true;

  constructor(private location: Location) { }

  ngOnInit(): void {
    this.location.onUrlChange((url: string) => {
      if (url !== '/cumple/inicio') {
        this.location.replaceState('/cumple/inicio');
      }
    });

    sessionStorage.clear();
  }

  logout(){
    this.iconoVisible=false
    sessionStorage.clear();
    localStorage.clear();
  }
  
}
