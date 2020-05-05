import { Component, OnInit } from '@angular/core';
import { flyIn } from 'src/assets/animations';
import { headShakeAnimation, slideInLeftAnimation,rubberBandAnimation } from 'angular-animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { CodegenService } from 'src/_service/codegen.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DbFormValues } from 'src/_model/DbFormValues';

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
  ddlArray :string[] = [];
  id;
  databaseForm: FormGroup;
  constructor(private codeGen: CodegenService) { }

  ngOnInit() {
    this.databaseForm = new FormGroup({
      hostName: new FormControl(''),
      username: new FormControl(''),
      dbName: new FormControl(''),
      password: new FormControl(''),
      ddlauto: new FormControl(''),
      dialect: new FormControl(''),
      showsql: new FormControl('')

     
  })
}

  getDB(dbName:string){
    console.log("dbname===>"+dbName)
    this.codeGen.getDbScreenDetails(dbName).subscribe(response=>{
      console.log("inside dbComponent===>",response);
      this.dialects = response.dialects;
      this.ddlArray = response.ddlAuto;
      this.id = response.id;
    })
this.enableHibernet = "false";
this.dbName = dbName;
  }
  sendDbDetails(){
    let dbVo : DbFormValues;
    dbVo.hostName = this.databaseForm.value.hostName;
    dbVo.dbType = this.dbName;
    dbVo.dbName = this.databaseForm.value.dbName;
    dbVo.username = this.databaseForm.value.username;
    dbVo.password = this.databaseForm.value.password;
    dbVo.dialect = this.databaseForm.value.dialect;
    dbVo.ddlauto = this.databaseForm.value.ddlAuto;
    dbVo.showsql = this.databaseForm.value.showsql;
    dbVo.isHibernate = this.enableHibernet;
    dbVo.id = this.id;
    let dbFormValueJson = JSON.stringify(dbVo);
sessionStorage.setItem('dbFormValue',dbFormValueJson);
this.codeGen.sendDbDetails(dbVo);
  }



}
