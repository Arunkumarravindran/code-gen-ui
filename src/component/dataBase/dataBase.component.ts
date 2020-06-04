import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/assets/animations';
import { headShakeAnimation, slideInLeftAnimation,rubberBandAnimation } from 'angular-animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { CodegenService } from 'src/_service/codegen.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DbFormValues } from 'src/_model/DbFormValues';
import { TooltipPosition } from '@angular/material';
import { DbDetails } from '../../_model/db/DbDetails';
import { ErrorService } from 'src/_service/error.service';

@Component({
  selector: 'app-dataBase',
  templateUrl: './dataBase.component.html',
  styleUrls: ['./dataBase.component.css'],
  animations:[
    flyIn,
    rubberBandAnimation(),
    headShakeAnimation(),
    slideInLeftAnimation(),
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()

]
})
export class DataBaseComponent implements OnInit {

  dbDetails: DbDetails;
  enableHibernet : string = "true";
  dbName : string;
  dialects :string[] =[];
  ddlAutoToolTip : string[]= [];
  dialectToolTip: string[] = [];
  selectedAddonList: string[] = [];
  ddlArray :string[] = [];
  id;
  toolPosition: TooltipPosition = 'below';
  databaseForm: FormGroup;
  constructor(private codeGen: CodegenService,private errorService:ErrorService) { }

  ngOnInit() {
    this.removeChildComponentSessionData();
    this.loadDbDetails();
    this.selectedAddonList = JSON.parse(sessionStorage.getItem('selectedAddon'))
    this.databaseForm = new FormGroup({
      hostName: new FormControl(''),
      username: new FormControl(''),
      dbName: new FormControl(''),
      password: new FormControl(''),
      ddlauto: new FormControl(''),
      dialect: new FormControl(''),
      showsql: new FormControl(''),
      isHibernet: new FormControl('no')
})
}

  getDB(dbName: string) {
    let data;
    console.log("dbname===>" + dbName)
    let dialect;
    let dllAuto;
    if(dbName == "mysql"){
      dialect = this.dbDetails.dbDetailList[0].dialects;
    }else if(dbName == "mssql"){
      dialect = this.dbDetails.dbDetailList[1].dialects;
    }else if(dbName == "oracle"){
      dialect = this.dbDetails.dbDetailList[2].dialects;
    }
    dllAuto = this.dbDetails.dllAuto;
      this.dialects = Object.keys(dialect);
      this.ddlArray = Object.keys(dllAuto);
      console.log("ddlauto===>" + JSON.stringify(dllAuto))
      console.log("ddlauto===>" + dialect)
      this.id = this.dbDetails.dbId;
      let tempDialect: string[] = [];
      Object.keys(dialect).forEach(key => {
        let data = key + ":" + dialect[key];
        tempDialect.push(data);

        console.log(tempDialect)
      })
      this.dialectToolTip = tempDialect;
      let tempDdl: string[] = [];
      Object.keys(dllAuto).forEach(key => {
        let data = key + ":" + dllAuto[key];
        tempDdl.push(data);

        console.log(tempDdl)
      })
      this.ddlAutoToolTip = tempDdl;

    this.enableHibernet = "false";
    this.dbName = dbName;
  }
  public loadDbDetails(){
    if(this.dbDetails == null){
      let db = JSON.parse(localStorage.getItem('customDbDetails'));
      this.dbDetails = db.body;
    }
    
  }
  sendDbDetails():boolean{

    if (!(this.databaseForm.value.hostName && this.databaseForm.value.dbName &&
      this.databaseForm.value.username && this.databaseForm.value.password)) {
      this.errorService.open("Please provide all the input for Database");
      return false;
    }
    // && this.databaseForm.value.dialect
    //&& this.databaseForm.value.ddlauto && this.databaseForm.value.showsql && this.databaseForm.value.isHibernet
   let respStruc ={
     hostName :this.databaseForm.value.hostName,
     dbType : this.dbName,
     dbName : this.databaseForm.value.dbName,
     username : this.databaseForm.value.username,
     password : this.databaseForm.value.password,
     dialect : this.databaseForm.value.dialect,
     ddlauto : this.databaseForm.value.ddlauto,
     showsql : this.databaseForm.value.showsql,
     isHibernate : this.databaseForm.value.isHibernet
   }
    let dbFormValueJson = JSON.stringify(respStruc)
    sessionStorage.setItem('dbFormValue',dbFormValueJson);
    return true;

  }

  private removeChildComponentSessionData(){
    sessionStorage.removeItem("dbFormValue");
    sessionStorage.removeItem("pipelineKubernetesFormGroupValue");
    sessionStorage.removeItem("pipelineJenkinsFormGroupValue");
  }



}
