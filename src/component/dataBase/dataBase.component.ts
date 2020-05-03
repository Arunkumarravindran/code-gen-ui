import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
@Component({
  selector: 'app-dataBase',
  templateUrl: './dataBase.component.html',
  styleUrls: ['./dataBase.component.css'],
  animations:[
    trigger("EnterLeave", [
    state("flyIn", style({ transform: "translateX(0)" })),
    transition(":enter", [
      style({ transform: "translateX(-100%)" }),
      animate("0.5s 300ms ease-in")
    ]),
    transition(":leave", [
      animate("0.3s ease-out", style({ transform: "translateX(100%)" }))
    ])
  ]),
trigger('displayState', [
  state('inactive', style({
    transform: 'scaleY(0)'
  })),
  state('active',   style({
    transform: 'scaleY(1)'
  })),
  transition('inactive => active', animate('500ms ease-in')),
  transition('active => inactive', animate('500ms ease-out'))
])
]
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
