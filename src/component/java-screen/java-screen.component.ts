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
  languages: LanguageValue[];
  projects: Value[];
  packaging: PackingValue[];
  javaVersion: JavaversionValue[];
  springVersion: BootversionValue[];
  name : string;
  group : string;
  codeGenForm : FormGroup;
  constructor(private codegenService : CodegenService,public dialog: MatDialog) { }


  ngOnInit() {
    this.getClient();
    this.codeGenForm = new FormGroup({
      project: new FormControl('', [
        Validators.required
      ]),
      language: new FormControl('', [
        Validators.required
      ]),
      bootVersion: new FormControl('', [
        Validators.required
      ]),
      // group: new FormControl('com.example', [
      //   Validators.required
      // ]),
      // artifact: new FormControl('demo', [
      //   Validators.required,
      // ]),
      // name: new FormControl('demo', [
      //   Validators.required
      // ]),
      description: new FormControl('Demo project for Spring Boot', [
        Validators.required
      ]),
      packageName: new FormControl('com.example.demo', [
        Validators.required
      ]),
      packaging: new FormControl('', [
        Validators.required
      ]),
      java: new FormControl('', [
        Validators.required,
      ]),
      dependencies: new FormControl('web', [
        Validators.required,
      ])
    });
  }

  generateProject(){
    this.codegenService.getResponse(this.codeGenForm.value).subscribe(response =>{
      let blob:any = new Blob([response], { type: 'application/zip' });

      fileSaver.saveAs(blob, 'test.zip');
    }), error => console.log('Error downloading the file' + error),
    () => console.info('File downloaded successfully');
  }
  languageCheckboxChange(event: MatCheckboxChange, index: number) {
    this.languageIndex = event.checked ? index : -1;
}
packagingCheckboxChange(event: MatCheckboxChange, index: number) {
  this.packIndex = event.checked ? index : -1;
}
projectCheckboxChange(event: MatCheckboxChange, index: number) {
  this.projectIndex = event.checked ? index : -1;
}

springVersionCheckboxChange(event: MatCheckboxChange, index: number) {
  this.springIndex = event.checked ? index : -1;
}

javaVersionCheckboxChange(event: MatCheckboxChange, index: number) {
  this.javaIndex = event.checked ? index : -1;
}


getClient(){
  if(localStorage.getItem('responseBody') == null){

    this.codegenService.getClient().subscribe(response=>{
      console.log("response", response)
      this.javaVersion = response.javaVersion.values;
      this.languages = response.language.values;
      this.packaging = response.packaging.values;
      this.springVersion = response.bootVersion.values;
      this.projects = response.type.values;
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
      this.projects = response.type.values;
      this.name = response.name.default;
      this.group = response.groupId.default;
  }
  
}


  openDependency() {
    const dialogRef = this.dialog.open(DependencyScreenComponent, {
      width: '50%',
      height: '500px'
   
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

}
}
