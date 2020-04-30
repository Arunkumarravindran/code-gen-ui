import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pipeLine',
  templateUrl: './pipeLine.component.html',
  styleUrls: ['./pipeLine.component.css']
})
export class PipeLineComponent implements OnInit {
java = true;
other =false;
  constructor() { }

  ngOnInit() {
  }


  changeScreen(){
    if(this.java == true){
    this.java = false;
    this.other = true;
    }
    else{
      this.java = true;
      this.other = false;
    }
  }
  changeScreenagin(){
  
  }

}
