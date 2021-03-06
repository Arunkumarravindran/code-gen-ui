import { Component, OnInit } from '@angular/core';
import { CodegenService } from 'src/_service/codegen.service';
import { Dependencies } from 'src/_model/dependencies';
import { Value } from 'src/_model/value';
import { DependenciesValue } from 'src/_model/dependenciesValue';
import { Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import  {bounceAnimation,rubberBandAnimation,headShakeAnimation,
  fadeInOnEnterAnimation,fadeOutOnLeaveAnimation} from 'angular-animations'
@Component({
  selector: 'app-dependency-screen',
  templateUrl: './dependency-screen.component.html',
  styleUrls: ['./dependency-screen.component.css'],
  animations:[
  fadeInOnEnterAnimation({ anchor: 'enter', duration: 200, delay: 80})
]
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
  
    
    
    if(sessionStorage.getItem('addedDependencies') == null){

      let allNexusDep = localStorage.getItem('nexus_dep');
      let allDependency = null;
      if(allNexusDep != null){
        allDependency = JSON.parse(allNexusDep).values;
      }else{
        let response = localStorage.getItem('responseBody');
        let parsedResponse = JSON.parse(response)
        this.addDependencyValues = parsedResponse;
        allDependency = parsedResponse.dependencies.values;
      }
      this.dependencies = allDependency;
}
else{
    let addedDependency = JSON.parse(sessionStorage.getItem('addedDependencies'));
    this.dependencies = addedDependency;
    }
  }

  addDependency(data:DependenciesValue,index :number,event) {
    console.log("checked ata -->",this.selectedRowsChecked);
    console.log("ctrl key -->",event.ctrlKey);
    if(event.ctrlKey){
      this.multiSelectMode = true;
      this.listDespendency.push(data);
      console.log("list of dependency -->",this.listDespendency);
      this.dependencies.forEach(singleGroup => {
        singleGroup.values.filter(singleDependency=>{
         if(singleDependency.id == data.id){
          singleGroup.values.splice(index,1)
         }
      })  
    });
    }else{
    this.dependencies.forEach(singleGroup => {
      singleGroup.values.filter(singleDependency=>{
       if(singleDependency.id == data.id){
        singleGroup.values.splice(index,1)
       }
    })  
  });
  sessionStorage.setItem('addedDependencies',JSON.stringify(this.dependencies))
  this.dialogRef.close({ event: 'close', data: data });
    }
   

  }
  
  clearInput() {
    this.searchValue = null;
   
  }
  addMultiDependency(){
    sessionStorage.setItem('addedDependencies',JSON.stringify(this.dependencies))
    this.dialogRef.close({ event: 'close', data: this.listDespendency });
  }

}
