import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, FormControl, Validators } from '@angular/forms';
import { JavaScreenComponent } from '../java-screen/java-screen.component';
import { EnvConf } from 'src/_model/envConf';
import { stringify } from 'querystring';
import { LogLevels } from 'src/_model/logLevels';
import { CodegenService } from 'src/_service/codegen.service';

@Component({
  selector: 'app-add-on-screen',
  templateUrl: './add-on-screen.component.html',
  styleUrls: ['./add-on-screen.component.css']
})
export class AddOnScreenComponent implements OnInit {
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
  logLevel: string[] = [];
  selectedLog: string[] = [];
  constructor(private formBuilder: FormBuilder, private java: JavaScreenComponent, private codeGen: CodegenService) { }

  ngOnInit() {
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
        case 'exception':
          this.enableexception = true;
          break;
        case 'logback':
          this.enableLogback = true;
          break;
      }
      if ($event.target.value == 'database' || $event.target.value == 'pipeline' || $event.target.value == 'redis') {
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
        case 'exception':
          this.enableexception = false;
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
    }
    if (this.enableDataBase && this.current == 3) {
      this.currentScreen = 'database';
    }
    if (this.enablePipe && this.current == 2 || (!this.enableDataBase && this.current == 3)) {
      this.currentScreen = 'addon';
      this.finalScreen = 3;
      this.java.addOnScreen();
    }
    this.prev = this.current--;
  }

  onNext() {
    this.java.otherScreen();
    if (this.enableDataBase && this.current == 1) {
      this.currentScreen = 'database';
      if (!this.enablePipe) {
        this.finalScreen = 2;
      }

    }
    if (this.enablePipe && this.current == 2 || (!this.enableDataBase && this.current == 1)) {
      this.currentScreen = 'pipeline';
      this.finalScreen = 3;
    }
    this.prev = this.current++;
    console.log("current screen", this.currentScreen, "currentpage", this.current);


  }
  generateProject() {
    console.log("formvalue", this.environmentForm.value)
    this.java.generateProject();
  }
  exploreProject() {
    this.formEnv()
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
      map.set(values.environment, envTypeList)
      
      array.push(json)
    })
    json = {
      applicationName: "string",
      envTypeList : map
    }
    this.codeGen.sendLogbackDetails(json).subscribe(respose => {
      console.log(respose)
    })

  }

}

