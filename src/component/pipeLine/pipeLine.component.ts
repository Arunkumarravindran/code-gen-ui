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
selectedAddonList :string[] = [];
  constructor() { }

  ngOnInit() {
    this.selectedAddonList = JSON.parse(sessionStorage.getItem('selectedAddon'))
  }


  getPipe(){

  }
  getCloud(){
    
  }
}
