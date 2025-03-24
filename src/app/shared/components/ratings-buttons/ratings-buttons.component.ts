import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ratings-buttons',
  standalone: true,
  imports: [],
  templateUrl: './ratings-buttons.component.html',
  styles: ``
})
export class RatingsButtonsComponent {
  @Output() onChangeRating: EventEmitter<string> = new EventEmitter<string>();

  selecionarCalificacion(calificacion: string) {
    this.onChangeRating.emit(calificacion);
  }
}
