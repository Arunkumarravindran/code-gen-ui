import { Component, OnInit, Input } from '@angular/core';
import {
  slideInLeftAnimation,
  slideInRightAnimation,
  slideOutLeftAnimation,
  slideOutRightAnimation,
  slideInUpOnEnterAnimation,
  
} from 'angular-animations';
@Component({
  selector: 'app-pageSlider',
  templateUrl: './pageSlider.component.html',
  styleUrls: ['./pageSlider.component.css'],
  animations: [
    slideInLeftAnimation({duration: 1000}),
    slideInRightAnimation({duration: 1000}),
    slideOutLeftAnimation({duration: 1000}),
    slideOutRightAnimation({duration: 1000}),
    slideInUpOnEnterAnimation({duration: 1000}),
  ]
})
export class PageSliderComponent implements OnInit {
  @Input() isIn = true;
  @Input() left = true;
  constructor() { }

  ngOnInit() {
  }
  

  get right() {
    return !this.left;
  }

  get isOut() {
    return !this.isIn;
  }
}
