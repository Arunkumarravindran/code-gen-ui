import { Component, OnInit } from '@angular/core';
import { CodegenService } from 'src/_service/codegen.service';
import { Dependencies } from 'src/_model/dependencies';
import { Value } from 'src/_model/value';
import { DependenciesValue } from 'src/_model/dependenciesValue';
import {  Inject, Optional } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dependency-screen',
  templateUrl: './dependency-screen.component.html',
  styleUrls: ['./dependency-screen.component.css']
})
export class DependencyScreenComponent implements OnInit {
  dependencies : Value[];
  addDependencies : DependenciesValue[] = [];
  searchValue:string;
  constructor(private codegenService : CodegenService,
    public dialogRef: MatDialogRef<DependencyScreenComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    let response = localStorage.getItem('responseBody');
    let parsedResponse = JSON.parse(response)
    this.dependencies = parsedResponse.dependencies.values;
  
  
  }

  addDependency(data,i){
this.dependencies.pop()
this.dialogRef.close({event:'close',data:data}); 

  }

  
  
}
