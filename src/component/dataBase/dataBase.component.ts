import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/assets/animations';
import { headShakeAnimation, slideInLeftAnimation,rubberBandAnimation } from 'angular-animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { CodegenService } from 'src/_service/codegen.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DbFormValues } from 'src/_model/DbFormValues';
import { TooltipPosition } from '@angular/material';

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
  constructor(private codeGen: CodegenService) { }

  ngOnInit() {
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

  getDB(dbName:string,check){
    let data;
    console.log("dbname===>"+dbName)
    this.codeGen.getDbScreenDetails(dbName).subscribe(response=>{
      console.log("inside dbComponent===>",response);
      this.dialects = Object.keys(response.dialects);
      this.ddlArray = Object.keys(response.ddlAuto);
      console.log("ddlauto===>"+JSON.stringify(response.ddlAuto))
      console.log("ddlauto===>"+response.dialects)
      this.id = response.id;
      let tempDialect: string[] = [];
      Object.keys(response.dialects).forEach(key=>{
        let data=  key + ":"+ response.dialects[key];
        tempDialect.push(data);
      
        console.log(tempDialect)
      })
      this.dialectToolTip = tempDialect;
      let tempDdl: string[] = [];
      Object.keys(response.ddlAuto).forEach(key=>{
        let data=  key + ":"+ response.ddlAuto[key];
        tempDdl.push(data);
      
        console.log(tempDdl)
      })
      this.ddlAutoToolTip = tempDdl;
    
    })
this.enableHibernet = "false";
this.dbName = dbName;
  }
  sendDbDetails(){
    console.log("SSds",this.databaseForm.value.hostName)
   
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
this.codeGen.sendDbDetails(respStruc).subscribe(resp=>{
  console.log(resp)
})
  }



}
