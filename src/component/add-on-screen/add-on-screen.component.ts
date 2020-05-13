import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-on-screen',
  templateUrl: './add-on-screen.component.html',
  styleUrls: ['./add-on-screen.component.css']
})
export class AddOnScreenComponent implements OnInit {
  selectedAddonList :string[] = [];
  selectedAddon :string;
  envForm : FormGroup;
  envValue: string; 
  enableEnvironment : boolean;
  constructor(
    private formBuilder: FormBuilder ) {}
  
  ngOnInit() {
if(sessionStorage.getItem('selectedAddon') != null){
    this.selectedAddonList = JSON.parse(sessionStorage.getItem('selectedAddon'))
}
    this.envValue = null;
    this.enableEnvironment = false;
    this.envForm = this.formBuilder.group({
      environment: this.formBuilder.array([
        this.formBuilder.control(null)
      ])
    })
  }
  environmentValue(){
    console.log("envi",this.envForm.value.env)
    this.envValue = this.envForm.value.environment;
    if(this.envForm.value.environment == [] || this.envForm.value.environment == ''){
      this.envValue = null;
    }
  }
  addEnv() {
    console.log("inside  add env");
    
    (this.envForm.get('environment') as FormArray).push(this.formBuilder.control(null));
  }
  removeEnv(index){
    console.log("inside  rm env", index);
    (this.envForm.get('environment') as FormArray).removeAt(index);
  }
  
  getEnvFormControls(): AbstractControl[] {
    return (<FormArray> this.envForm.get('environment')).controls
  }
  getAddon($event){

    

    console.log("event",$event.target.value);
    if($event.target.checked == true){
      if($event.target.value == 'logback'){
        this.enableEnvironment = true;
      }
      this.selectedAddonList.push($event.target.value);
    }else if($event.target.checked == false){
      if($event.target.value == 'logback'){
        this.enableEnvironment = false;
      }
      let index = this.selectedAddonList.findIndex(data=> data == $event.target.value)
      this.selectedAddonList.splice(index,1);
    }

}
proceed( addonList ){
  console.log(addonList);
  
 sessionStorage.setItem('selectedAddon',JSON.stringify(addonList));
}
}
