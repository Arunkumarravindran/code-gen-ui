import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { JavaScreenComponent } from '../java-screen/java-screen.component';

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
  enableexception : boolean;
  enableRedis : boolean;
  enablePipe : boolean;
  enableDataBase : boolean;
  enableLogback : boolean;
  finalScreen = 4;
  current = 1;
  prev = 0;
  dialects : any[] = ['info','debug']
  constructor(private formBuilder: FormBuilder, private java :JavaScreenComponent ) {}
  
  ngOnInit() {
if(sessionStorage.getItem('selectedAddon') != null){
    this.selectedAddonList = JSON.parse(sessionStorage.getItem('selectedAddon'))
    let checkedList= JSON.parse(sessionStorage.getItem('checkedList'))
    console.log("checkList",checkedList);
    
    this.enableDataBase = checkedList.databaseCheck;
    this.enableRedis = checkedList.redisCheck;
    this.enablePipe = checkedList.pipeCheck;
    this.enableexception = checkedList.exceptionCheck;
    this.enableLogback = checkedList.logbackCheck;
}else{
    this.envValue = null;
    this.enableDataBase = false;
    this.enableRedis = false;
    this.enablePipe = false;
    this.enableexception = false;
    this.enableLogback = false
}
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
      switch ($event.target.value) {
        case 'database':
          this.enableDataBase = true;
            break;
        case 'pipeline':
            this.enablePipe = true;
            break;
        case 'redis':
            this.enableRedis = true;
            break;
        case 'exception':
            this.enableexception = true;
            break;
        case 'logback':
          this.enableLogback = true;
            break;
    }
      if($event.target.value == 'database' || $event.target.value == 'pipeline' || $event.target.value == 'redis'){
        this.selectedAddonList.push($event.target.value);
      }
    }else if($event.target.checked == false){
      if($event.target.value == 'logback'){
        this.enableEnvironment = false;
      }
      switch ($event.target.value) {
        case 'database':
          this.enableDataBase = false;
            break;
        case 'pipeline':
            this.enablePipe = false;
            break;
        case 'redis':
            this.enableRedis = false;
            break;
        case 'exception':
            this.enableexception = false;
            break;
        case 'logback':
          this.enableLogback = false;
            break;
      }
      if($event.target.value == 'database' || $event.target.value == 'pipeline' || $event.target.value == 'redis'){
     
      let index = this.selectedAddonList.findIndex(data=> data == $event.target.value)
      this.selectedAddonList.splice(index,1);
    }
  }

}
proceed( addonList ){
  console.log(addonList);
  let checkedList = {
    databaseCheck : this.enableDataBase,
    redisCheck : this.enableRedis,
    exceptionCheck : this.enableexception,
    logbackCheck : this.enableLogback,
    pipeCheck : this.enablePipe

  }
  sessionStorage.setItem('checkedList',JSON.stringify(checkedList));
 sessionStorage.setItem('selectedAddon',JSON.stringify(addonList));
 this.prev = this.current++;
}
onPrev() {
  this.prev = this.current--;
}

onNext() {
  this.prev = this.current++;

}
generateProject(){
this.java.generateProject();
}
exploreProject(){
  this.java.exploreProject();
}
}
