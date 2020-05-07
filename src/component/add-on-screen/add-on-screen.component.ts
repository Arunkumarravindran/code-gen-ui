import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-on-screen',
  templateUrl: './add-on-screen.component.html',
  styleUrls: ['./add-on-screen.component.css']
})
export class AddOnScreenComponent implements OnInit {
  selectedAddonList :string[] = [];
  selectedAddon :string;
  constructor() { }

  ngOnInit() {
  }
  getAddon($event){

    console.log("event",$event.target.value);
    if($event.target.checked == true){
      this.selectedAddonList.push($event.target.value);
    }else if($event.target.checked == false){
      let index = this.selectedAddonList.findIndex(data=> data == $event.target.value)
      this.selectedAddonList.splice(index,1);
    }

}
}
