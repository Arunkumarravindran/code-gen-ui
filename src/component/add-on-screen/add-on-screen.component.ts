import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl, Validators } from '@angular/forms';
import { JavaScreenComponent } from '../java-screen/java-screen.component';
import { EnvConf } from 'src/_model/envConf';
import { stringify } from 'querystring';
import { LogLevels } from 'src/_model/logLevels';
import { CodegenService } from 'src/_service/codegen.service';
import { Value } from '../../_model/addOns/typeValue';
import { DataBaseComponent } from '../dataBase/dataBase.component';
import { PipeLineComponent } from '../pipeLine/pipeLine.component';
import { ErrorService } from 'src/_service/error.service';

@Component({
  selector: 'app-add-on-screen',
  templateUrl: './add-on-screen.component.html',
  styleUrls: ['./add-on-screen.component.css']
})
export class AddOnScreenComponent implements OnInit {
  @ViewChild(DataBaseComponent,{static: false}) dbComponent:DataBaseComponent;
  @ViewChild(PipeLineComponent,{static: false}) pipeComponent:PipeLineComponent;
  addONList:Value[];
  selectedAddonList: string[] = [];
  selectedAddon: string;
  envForm: FormGroup;
  environmentForm: FormGroup;
  envValue: string;
  enableEnvironment: boolean;
  enableexception: boolean;
  enableRedis: boolean;
  enableSwagger : boolean;
  enablePipe: boolean;
  enableDataBase: boolean;
  enableLogback: boolean;
  contextValue : string ;
  finalScreen;
  current = 1;
  prev = 0;
  currentScreen;
  isNextButtonAvailable:boolean = false;
  logLevel: string[] = [];
  selectedLog: string[] = [];
  
  constructor(private formBuilder: FormBuilder, private java: JavaScreenComponent,private errorService:ErrorService, private codeGen: CodegenService) { }

  ngOnInit() {
    this.removeChildComponentSessionData();
    this.currentScreen = 'addon';
    this.loadAddONs();
    this.validate()
    if (sessionStorage.getItem('selectedAddon') != null) {
      this.selectedAddonList = JSON.parse(sessionStorage.getItem('selectedAddon'))
      let checkedList = JSON.parse(sessionStorage.getItem('checkedList'))
      console.log("checkList", checkedList);

      this.enableDataBase = checkedList.databaseCheck;
      this.enableRedis = checkedList.redisCheck;
      this.enablePipe = checkedList.pipeCheck;
      this.enableexception = checkedList.exceptionCheck;
      this.enableLogback = checkedList.logbackCheck;
      this.enableSwagger = checkedList.swaggerChecked;
    } else {
      this.envValue = null;
      this.enableDataBase = false;
      this.enableRedis = false;
      this.enablePipe = false;
      this.enableexception = false;
      this.enableLogback = false;
      this.enableSwagger = false;
    }
    this.envForm = this.formBuilder.group({
      environment: this.formBuilder.array([
        this.formBuilder.control(null)
      ])
    })
    setTimeout((res) => {
      this.logLevel = ["info", "debug", "error", "warning"];
    });

  }

  public loadAddONs(){
    if(this.addONList == null)
    this.addONList = JSON.parse(localStorage.getItem('customAddOns'));
  }

  public validate(): void {
    this.environmentForm = new FormGroup({
      'formArray': new FormArray([
        this.initForm()
      ])
    });
    // this.environmentForm.valueChanges.subscribe(data => console.log(data));
  }

  get f() { return this.environmentForm.controls; }

  public initForm(): FormGroup {
    return new FormGroup({
      'environment': new FormControl('', [Validators.required]),
      'log': new FormControl(''),
      'context': new FormControl(this.contextValue)
    });
  }
  public addEnv(context): void {
    this.contextValue = context;
    const control = <FormArray>this.f.formArray;
    control.push(this.initForm());
  }

  onChange(event, index) {
    const control = (<FormArray>this.f.formArray).at(index).get('log') as FormArray;
    if (event.checked) {
      control.push(new FormControl(event.source.value))
    } else {
      const i = control.controls.findIndex(x => x.value === event.source.value);
      control.removeAt(i);
    }
  }

  environmentValue() {

    this.environmentForm.value.formArray.filter(values => {
      this.envValue = values.environment;
      console.log("envi", this.envValue)
    })
    if (this.environmentForm.value.environment == [] || this.environmentForm.value.environment == '') {
      this.envValue = null;
    }
  }

  removeEnv(index) {
    console.log("inside  rm env", index);
    (this.environmentForm.get('formArray') as FormArray).removeAt(index);
  }

  getAddon($event) {
    console.log("event", $event.target.value);
    if ($event.target.checked == true) {
      if ($event.target.value == 'logback') {
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
        case 'swagger':
          this.enableSwagger = true;
          sessionStorage.setItem("swaggerItem","swagger-id");
          break;
        case 'logback':
          this.enableLogback = true;
          break;
      }
      if ($event.target.value == 'database' || $event.target.value == 'pipeline') {
        this.selectedAddonList.push($event.target.value);
      }
    } else if ($event.target.checked == false) {
      if ($event.target.value == 'logback') {
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
        case 'swagger':
          this.enableSwagger = false;
          sessionStorage.removeItem("swaggerItem");
          break;
        case 'logback':
          this.enableLogback = false;
          break;
      }
      if ($event.target.value == 'database' || $event.target.value == 'pipeline' || $event.target.value == 'redis') {

        let index = this.selectedAddonList.findIndex(data => data == $event.target.value)
        this.selectedAddonList.splice(index, 1);
      }
    }

  }
  proceed(addonList) {
    console.log(addonList);
    let checkedList = {
      databaseCheck: this.enableDataBase,
      redisCheck: this.enableRedis,
      exceptionCheck: this.enableexception,
      logbackCheck: this.enableLogback,
      pipeCheck: this.enablePipe,
      swaggerChecked: this.enableSwagger

    }
    sessionStorage.setItem('checkedList', JSON.stringify(checkedList));
    sessionStorage.setItem('selectedAddon', JSON.stringify(addonList));
    this.onNext();

  }
  onPrev() {
    if (this.current == 2) {
      this.currentScreen = 'addon';
      this.java.addOnScreen();
    }
    if (this.enableDataBase && this.current == 3) {
      this.currentScreen = 'database';
    }
    if (this.enablePipe && this.current == 2 || (!this.enableDataBase && this.current == 3)) {
      this.currentScreen = 'addon';
      this.finalScreen = 3;
    }
    this.prev = this.current--;
  }

  onNext() {
    this.java.otherScreen();
    if (this.enableDataBase && this.current == 1) {
      this.currentScreen = 'database';
      if (!this.enablePipe) {
        this.finalScreen = 2;
        this.isNextButtonAvailable = false;
      }else
      this.isNextButtonAvailable = true;

    }
    if (this.enablePipe && this.current == 2 || (!this.enableDataBase && this.current == 1)) {
      this.currentScreen = 'pipeline';
      this.finalScreen = 3;
      this.isNextButtonAvailable = false;
    }
    this.prev = this.current++;
    console.log("current screen", this.currentScreen, "currentpage", this.current);


  }
  generateProject() {
    this.formEnv()
    if (this.enableDataBase && this.dbComponent == undefined && this.enablePipe && this.pipeComponent == undefined) {
      this.errorService.open("Please provide input for Selected addONs");
      return
    } else if (this.enableDataBase && this.dbComponent == undefined) {
      this.errorService.open("Please provide input for Database");
      return
    } else if (this.enablePipe && this.pipeComponent == undefined) {
      this.errorService.open("Please provide input for Pipeline");
      return
    }
    if (this.dbComponent)
      if (!this.dbComponent.sendDbDetails()) {
        return
      }
    if (this.pipeComponent)
      if (!this.pipeComponent.storePipleline()) {
        return
      }
    this.java.generateProject();
  }
  exploreProject() {
    this.formEnv();
    if (this.enableDataBase && this.dbComponent == undefined && this.enablePipe && this.pipeComponent == undefined) {
      this.errorService.open("Please provide input for Selected addONs");
      return
    } else if (this.enableDataBase && this.dbComponent == undefined) {
      this.errorService.open("Please provide input for Database");
      return
    } else if (this.enablePipe && this.pipeComponent == undefined) {
      this.errorService.open("Please provide input for Pipeline");
      return
    }
    if (this.dbComponent)
      if (!this.dbComponent.sendDbDetails()) {
        return
      }
    if (this.pipeComponent)
      if (!this.pipeComponent.storePipleline()) {
        return
      }
    this.java.exploreProject();
  }
  formEnv() {
    let map = new Map<string, LogLevels>();
    let json;
    let array: any[] = [];
    this.environmentForm.value.formArray.filter(values => {
   
      let envTypeList = {
        contextPath: values.context,
        logLevel: values.log
      }
      //map.set(values.environment, envTypeList)
      map[values.environment] = envTypeList;
      
      array.push(json)
    })
    json = {
      applicationName: "string",
      port: 8080,
      envTypeList : map
    }
    let stringifyJson = JSON.stringify(json)
    sessionStorage.setItem('envDetails',stringifyJson)

  }

  private removeChildComponentSessionData(){
    sessionStorage.removeItem("dbFormValue");
    sessionStorage.removeItem("pipelineKubernetesFormGroupValue");
    sessionStorage.removeItem("pipelineJenkinsFormGroupValue");
    sessionStorage.removeItem("envDetails");
  }

}

