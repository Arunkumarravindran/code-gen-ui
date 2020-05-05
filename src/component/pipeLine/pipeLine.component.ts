import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/assets/animations';

@Component({
  selector: 'app-pipeLine',
  templateUrl: './pipeLine.component.html',
  styleUrls: ['./pipeLine.component.css'],
  animations:[ flyIn]
})
export class PipeLineComponent implements OnInit {
java = true;
other =false;
  constructor() { }

  ngOnInit() {
  }


  getPipe(){

  }
  getCloud(){
    
  }
}
