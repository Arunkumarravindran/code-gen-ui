import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dataBase',
  templateUrl: './dataBase.component.html',
  styleUrls: ['./dataBase.component.css']
})
export class DataBaseComponent implements OnInit {

  enableHibernet = true;
  dialects = [
    {value: '', viewValue: ''},
    {value: '', viewValue: ''},
    {value: '', viewValue: ''}
  ];

  ddlArray = [
    {value: 'validate', viewValue: 'Validate'},
    {value: 'update', viewValue: 'Update'},
    {value: 'create-drop', viewValue: 'Create-Drop'}
  ];
  constructor() { }

  ngOnInit() {
  }

  getDB(dbName:string){
    console.log("dbname===>"+dbName)
this.enableHibernet = false;
  }

}
