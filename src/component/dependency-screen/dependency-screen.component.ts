import { Component, OnInit } from '@angular/core';
import { CodegenService } from 'src/_service/codegen.service';
import { Dependencies } from 'src/_model/dependencies';
import { Value } from 'src/_model/value';
import { DependenciesValue } from 'src/_model/dependenciesValue';
import { Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dependency-screen',
  templateUrl: './dependency-screen.component.html',
  styleUrls: ['./dependency-screen.component.css']
})
export class DependencyScreenComponent implements OnInit {
  dependencies: Value[];
  listDespendency = [];
  addDependencies: DependenciesValue[] = [];
  addDependencyValues: DependenciesValue[] = [];
  searchValue: string;
  multiSelectMode = false;
  selectedRowsChecked = [];
  constructor(private codegenService: CodegenService,
    public dialogRef: MatDialogRef<DependencyScreenComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    let response = localStorage.getItem('responseBody');
    let parsedResponse = JSON.parse(response)
     console.log("ffgfg",parsedResponse);
    
    let allDependency = parsedResponse.dependencies.values;
    this.dependencies = allDependency;
     let depValues : DependenciesValue[]= allDependency.map(value=>{
       return value.values;
     })
     
    this.addDependencyValues = depValues;
    // console.log("dffd",this.addDependencyValues);
  }

  addDependency(data:DependenciesValue,index :number,event) {
    console.log("checked ata -->",this.selectedRowsChecked);
    console.log("ctrl key -->",event.ctrlKey);
    if(event.ctrlKey){
      this.multiSelectMode = true;
      this.listDespendency.push(data);
      console.log("list of dependency -->",this.listDespendency);this.dependencies.forEach(d => {
        d.values.filter(subBrand=>{
         if(subBrand.id == data.id){
         d.values.splice(index,1)
         }
      })  
    });
    if(!event.ctrlKey){
      this.dialogRef.close({ event: 'close', data: this.listDespendency });
    }
    
      
     // this.dialogRef.close({ event: 'close', data: listDespendency });
    }else{
    this.dependencies.forEach(d => {
      d.values.filter(subBrand=>{
       if(subBrand.id == data.id){
       d.values.splice(index,1)
       }
    })  
  });
  this.dialogRef.close({ event: 'close', data: data });
    }
   

  }
  
  clearInput() {
    this.searchValue = null;
   
  }
  addMultiDependency(){
    this.dialogRef.close({ event: 'close', data: this.listDespendency });
  }

}
