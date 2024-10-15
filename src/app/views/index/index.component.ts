import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
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
