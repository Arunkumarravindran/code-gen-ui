import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CodegenService } from 'src/_service/codegen.service';
import * as fileSaver from 'file-saver';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import{DependencyScreenComponent} from 'src/component/dependency-screen/dependency-screen.component'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LanguageValue } from 'src/_model/languageValue';
import { JavaversionValue } from 'src/_model/javaversionValue';
import { BootversionValue } from 'src/_model/bootversionValue';
import { PackingValue } from 'src/_model/packagingValue';
import { Value } from 'src/_model/value';
import { Name } from 'src/_model/name';
import { DependenciesValue } from 'src/_model/dependenciesValue';
import { ProjectValue } from 'src/_model/projectValue';


@Component({
  selector: 'app-java-screen',
  templateUrl: './java-screen.component.html',
  styleUrls: ['./java-screen.component.css']
})
export class JavaScreenComponent implements OnInit {
  languageIndex = -1;
  projectIndex = -1;
  packIndex = -1;
  javaIndex = -1;
  springIndex = -1;
  indexCheck :boolean;
  languages: LanguageValue[];
  projects: ProjectValue[];
  packaging: PackingValue[];
  javaVersion: JavaversionValue[];
  springVersion: BootversionValue[];
  addDependencies : DependenciesValue[] = [];
  name : string;
  group : string;
  codeGenForm : FormGroup;
  constructor(private codegenService : CodegenService,public dialog: MatDialog) { }


  ngOnInit() {
    this.codegenService.handleError
    this.getClient();
    this.codeGenForm = new FormGroup({
      projectName: new FormControl('maven-project', [
        Validators.required
      ]),
      languageType: new FormControl('java', [
        Validators.required
      ]),
      bootVersion: new FormControl('2.2.6.RELEASE', [
        Validators.required
      ]),
      group: new FormControl('', [
        Validators.required
      ]),
      artifact: new FormControl('', [
        Validators.required,
      ]),
      name: new FormControl('', [
        Validators.required
      ]),
      description: new FormControl('Demo project for Spring Boot', [
        Validators.required
      ]),
      packageName: new FormControl('com.example.demo', [
        Validators.required
      ]),
      packaging: new FormControl('jar', [
        Validators.required
      ]),
      java: new FormControl('1.8', [
        Validators.required,
      ]),
      dependencies: new FormControl('', [
        Validators.required,
      ])
    });
  }
  
  generateProject(){
    let fileName:string
    this.codeGenForm.value.group = this.group;
    this.codeGenForm.value.artifact = this.name;
    this.codeGenForm.value.name = this.name;
    this.codeGenForm.value.dependencies = Array.prototype.map.call(this.addDependencies, (s: { id: string; }) => s.id).toString();
    console.log(this.codeGenForm.value)
    this.codegenService.getFileName(this.codeGenForm.value).subscribe(res => {
      let contentDisposition = res.headers.get('Content-Disposition');
      const r = /(?:filename=")(.+)(?:")/
      fileName = r.exec(contentDisposition)[1];
    })
    this.codegenService.getResponse(this.codeGenForm.value).subscribe(response =>{
      let blob:any = new Blob([response], { type: 'application/zip' });

      fileSaver.saveAs(blob, fileName);
    }), error => console.log('Error downloading the file' + error),
    () => console.info('File downloaded successfully');
  }
languageCheckboxChange(event: MatCheckboxChange, index: number, id:string) {
    this.languageIndex = event.checked ? index : -1;
    this.codeGenForm.value.languageType = id;
}
packagingCheckboxChange(event: MatCheckboxChange, index: number, id:string) {
  this.packIndex = event.checked ? index : -1;
  this.codeGenForm.value.packaging = id;
}
projectCheckboxChange(event: MatCheckboxChange, index: number, id:string) {
  this.projectIndex = event.checked ? index : -1;
  this.codeGenForm.value.projectName = id;
}

springVersionCheckboxChange(event: MatCheckboxChange, index: number, id:string) {
  this.springIndex = event.checked ? index : -1;
  this.codeGenForm.value.bootVersion = id;
}

javaVersionCheckboxChange(event: MatCheckboxChange, index: number, id:string) {
  this.javaIndex = event.checked ? index : -1;
  this.codeGenForm.value.java = id;
}


getClient(){
  if(localStorage.getItem('responseBody') == null){

    this.codegenService.getClient().subscribe(response=>{
      console.log("response", response)
      this.javaVersion = response.javaVersion.values;
      this.languages = response.language.values;
      this.packaging = response.packaging.values;
      this.springVersion = response.bootVersion.values;
      this.projects = response.type.values.filter(data =>{
       return data.name.search(new RegExp('Project', "i")) != -1
      })
      this.name = response.name.default;
      this.group = response.groupId.default;
    })
  }
  else{
    let resp = localStorage.getItem('responseBody');
    let response = JSON.parse(resp);
    this.javaVersion = response.javaVersion.values;
      this.languages = response.language.values;
      this.packaging = response.packaging.values;
      this.springVersion = response.bootVersion.values;
      this.projects = response.type.values.filter(data =>{
        return data.name.search(new RegExp('Project', "i")) != -1
       })
      this.name = response.name.default;
      this.group = response.groupId.default;
  }
  
}


  openDependency() {
    const dialogRef = this.dialog.open(DependencyScreenComponent, {
      width: '50%',
      height: '600px'
   
    });
    dialogRef.afterClosed().subscribe(result => {
      let value = this.addDependencies.map(data=>{
        console.log(data.id == result.data.id)
           if(data.id == result.data.id) {
this.indexCheck = true;
      }
      else{
        this.indexCheck = false;
      }});
      
      if(!this.indexCheck){
        this.addDependencies.push( result.data);
        console.log('The dialog was closed', this.addDependencies);
      
      }
       
    });

  }

  removeDepenency(index : number){
    this.addDependencies.splice(index,1);
  }
  

}
