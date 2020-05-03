import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CodegenService } from 'src/_service/codegen.service';
import * as fileSaver from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DependencyScreenComponent } from 'src/component/dependency-screen/dependency-screen.component'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LanguageValue } from 'src/_model/languageValue';
import { JavaversionValue } from 'src/_model/javaversionValue';
import { BootversionValue } from 'src/_model/bootversionValue';
import { PackingValue } from 'src/_model/packagingValue';
import { DependenciesValue } from 'src/_model/dependenciesValue';
import { ProjectValue } from 'src/_model/projectValue';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import * as load from 'lodash';
import { Files } from 'src/_model/files';
import { FileExplorerScreenComponent } from '../fileExplorer-Screen/fileExplorer-Screen.component';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";
@Component({
  selector: 'app-java-screen',
  templateUrl: './java-screen.component.html',
  styleUrls: ['./java-screen.component.css'],
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
trigger("fadeInOut", [
  state(
    "void",
    style({
      opacity: 0
    })
  ),
  transition("void <=> *", animate(500))
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
export class JavaScreenComponent implements OnInit {
  languageIndex = -1;
  projectIndex = -1;
  packIndex = -1;
  javaIndex = -1;
  hideBootVersion = true;
  finalScreen = 3;
  springIndex = -1;
  current = 1;
  prev = 0;
  mainScreen = true;
  dbScreen = false;
  indexCheck: boolean;
  languages: LanguageValue[];
  projects: ProjectValue[];
  packaging: PackingValue[];
  javaVersion: JavaversionValue[];
  springVersion: BootversionValue[];
  addDependencies: DependenciesValue[] = [];
  name: string;
  group: string;
  codeGenForm: FormGroup;
  constructor(private codegenService: CodegenService, public dialog: MatDialog, private router: Router) { }


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

  generateProject() {
    console.log("inside generate project");

    let fileName: string
    this.codeGenForm.value.group = this.group;
    this.codeGenForm.value.artifact = this.name;
    this.codeGenForm.value.name = this.name;
    this.codeGenForm.value.packageName = this.group + '.' + this.name;
    this.codeGenForm.value.dependencies = Array.prototype.map.call(this.addDependencies, (s: { id: string; }) => s.id).toString();
    console.log(this.codeGenForm.value)
    this.codegenService.getFileName(this.codeGenForm.value).subscribe(res => {
      let contentDisposition = res.headers.get('Content-Disposition');
      const r = /(?:filename=")(.+)(?:")/
      fileName = r.exec(contentDisposition)[1];
    })
    this.codegenService.getResponse(this.codeGenForm.value).subscribe(response => {
      let blob: any = new Blob([response], { type: 'application/zip' });

      fileSaver.saveAs(blob, fileName);
    },
    (error) => {
     console.log('Error downloading the file ' +error)
    })
  }
  
  getClient() {
    if (localStorage.getItem('responseBody') == null) {

      this.codegenService.getClient().subscribe(response => {
        console.log("response", response)
        this.javaVersion = response.javaVersion.values;
        this.languages = response.language.values;
        this.packaging = response.packaging.values;
        this.springVersion = response.bootVersion.values;
        this.projects = response.type.values.filter(data => {
          return data.name.search(new RegExp('Project', "i")) != -1
        })
        this.name = response.name.default;
        this.group = response.groupId.default;
      })
    }
    else {
      let resp = localStorage.getItem('responseBody');
      let response = JSON.parse(resp);
      this.javaVersion = response.javaVersion.values;
      this.languages = response.language.values;
      this.packaging = response.packaging.values;
      this.springVersion = response.bootVersion.values;
      this.projects = response.type.values.filter(data => {
        return data.name.search(new RegExp('Project', "i")) != -1
      })
      this.name = response.name.default;
      this.group = response.groupId.default;
    }

  }


  openDependency() {
    const dialogRef = this.dialog.open(DependencyScreenComponent, {
      width: '45%',
      height: '600px'

    });
    dialogRef.afterClosed().subscribe(result => {
      let value = this.addDependencies.filter(data => {
        console.log(data.id == result.data.id)
        if (data.id.includes(result.data.id)) {
          this.indexCheck = true;
        }
        else {
          this.indexCheck = false;
        }
      });

      if (!this.indexCheck) {
        this.addDependencies.push(result.data);
        console.log('The dialog was closed', this.addDependencies);

      }

    });

  }

  openExplore(result) {
    const dialogRef = this.dialog.open(FileExplorerScreenComponent, {
      width: 'auto',
      height: 'auto'

    });
    dialogRef.componentInstance.exploreResult = result;
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "download") {
        this.generateProject();
      }
    })
  }

  removeDepenency(index: number) {
    this.addDependencies.splice(index, 1);
  }

  redirectHome() {
    this.router.navigate(['/homeScreen'])
  }
  exploreProject() {
    this.codeGenForm.value.group = this.group;
    this.codeGenForm.value.artifact = this.name;
    this.codeGenForm.value.name = this.name;
    this.codeGenForm.value.packageName = this.group + '.' + this.name;
    this.codeGenForm.value.dependencies = Array.prototype.map.call(this.addDependencies, (s: { id: string; }) => s.id).toString();
    console.log(this.codeGenForm.value)
    this.codegenService.getResponse(this.codeGenForm.value).subscribe(async response => {
      let blob: any = new Blob([response], { type: 'application/zip' });
      var zip = new JSZip();
      let zipResp = await zip.loadAsync(blob).then((zip) => { return zip; });
      let file: Files = zipResp;
      let path = `${this.findRoot(file)}/`
      console.log('Path Resp -> ' + path)
      const result = await this.createTree(file, path, path, zip).catch(() => {
        throw Error(`Could not read the ZIP project.`)
      })
      this.openExplore(JSON.stringify(result));
    })
  }
  findRoot(zip: Files) {
    const root = Object.keys(zip.files).filter(filename => {
      const pathArray = filename.split('/')
      if (zip.files[filename].dir && pathArray.length === 2) {
        return true
      }
      return false
    })[0]
    return root.substring(0, root.length - 1)
  }
  next(){
    this.mainScreen = false;
    this.dbScreen = true;
  }
  previous(){
    this.mainScreen = true;
    this.dbScreen = false;
  }
  getLanguage(file) {
    const FILE_EXTENSION = {
      js: 'javascript',
      md: 'markdown',
      kt: 'kotlin',
      kts: 'kotlin',
      gradle: 'groovy',
      gitignore: 'git',
      java: 'java',
      xml: 'xml',
      properties: 'properties',
      groovy: 'groovy',
    }
    if (!file.includes(`.`)) {
      return null
    }
    const extension = file.split(`.`).pop()
    return load.get(FILE_EXTENSION, extension, null)
  }
  createTree(files, path: string, fileName: string, zip: JSZip) {
    console.log('Inside Create tree')
    return new Promise(resolve => {
      const recursive = (pfiles, ppath, pfileName, pzip, pdepth) => {
        const type = pfiles.files[ppath].dir ? 'folder' : 'file'

        const item = {
          type,
          filename: pfileName,
          path: `/${ppath}`,
          hidden: pdepth === 1 && type === 'folder' ? true : null,
          children: [],
          language: '',
          content: []
        }
        if (type === 'folder') {
          console.log('Inside If folder')
          const children = []
          pzip.folder(ppath).forEach((relativePath, file) => {
            const pathArray = relativePath.split('/')
            if (pathArray.length === 1 || (file.dir && pathArray.length === 2)) {
              children.push(
                recursive(
                  pfiles,
                  ppath + relativePath,
                  relativePath,
                  pzip,
                  pdepth + 1
                )
              )
            }
          })
          item.children = children.sort((a, b) => (a.path > b.path ? 1 : -1))
          item.filename = pfileName.substring(0, pfileName.length - 1)
        } else {
          console.log('Inside Else File')
          item.language = this.getLanguage(item.filename)
          if (item.language) {
            pfiles.files[ppath].async('string').then(content => {
              item.content = content
            })
          }
        }
        return item
      }
      const tree = recursive(files, path, fileName, zip, 0)
      const selected = tree.children.find(
        item =>
          ['pom.xml', 'build.gradle', 'build.gradle.kts'].indexOf(item.filename) >
          -1
      )
      if (selected) {
        files.files[selected.path.substring(1)].async('string').then(content => {
          selected.content = content
          resolve({ tree, selected })
        })
      } else {
        resolve({ tree, selected: null })
      }
    })
  }

  onPrev() {
    this.prev = this.current--;
  }

  onNext() {
    this.prev = this.current++;
  }
  onskip(){
    this.prev = this.current++;
  }
  isLeftTransition(idx: number): boolean {
    return this.current === idx ? this.prev > this.current : this.prev < this.current;
  }
  getCheckedLanguage(language:string){
console.log("language checked ==>",language);
if(language == "java"){
  this.hideBootVersion = true;
}else{
  this.hideBootVersion = false;
}
  }
}
