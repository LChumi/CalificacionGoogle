import {Component, EventEmitter, Output} from '@angular/core';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-ratings-star',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './ratings-star.component.html',
  styles: ``
})
export class RatingsStarComponent {

  @Output() onChangeRatingStar: EventEmitter<number> = new EventEmitter<number>();

  rating: number = 0; // Valor de la calificación
  maxRating = 5;
  stars = Array(this.maxRating).fill(0);

  rate(value: number) {
    this.rating = value;
    this.onChangeRatingStar.emit(this.rating * 2); // Emite el evento con la calificación actual
  }

  getStarClass(index: number, value: number) {
    return {
      'text-yellow-400': this.rating >= index + value,
      'text-gray-300': this.rating < index + value
    };
  }

}
