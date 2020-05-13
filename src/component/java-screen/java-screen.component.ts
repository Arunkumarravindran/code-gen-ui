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
import { flyIn } from 'src/assets/animations';
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { Value } from 'src/_model/value';
@Component({
  selector: 'app-java-screen',
  templateUrl: './java-screen.component.html',
  styleUrls: ['./java-screen.component.css'],
  animations: [
    flyIn,
    fadeInOnEnterAnimation({ anchor: 'enter', duration: 200, delay: 50 }),
    fadeOutOnLeaveAnimation({ anchor: 'leave', duration: 200, delay: 50 })
  ]
})
export class JavaScreenComponent implements OnInit {
  languageIndex = -1;
  projectIndex = -1;
  packIndex = -1;
  javaIndex = -1;
  hideBootVersion = true;
  finalScreen = 2;
  springIndex = -1;
  current = 1;
  prev = 0;
  mainScreen = true;
  dbScreen = false;
  pipeScreen = false;
  redisScreen = false;
  exceptionScreen = false;
  indexCheck: boolean;
  languages: LanguageValue[];
  projects: ProjectValue[];
  packaging: PackingValue[];
  javaVersion: JavaversionValue[];
  springVersion: BootversionValue[];
  addDependencies: DependenciesValue[] = [];
  dependencies: Value[];
  name: string;
  group: string;
  v : any[] = [];
  codeGenForm: FormGroup;
  values = [{ "name": "Developer Tools", "values": [{ "id": "devtools", "name": "Spring Boot DevTools", "description": "Provides fast application restarts, LiveReload, and configurations for enhanced development experience.", "_links": { "reference": { "href": "https://docs.spring.io/spring-boot/docs/{bootVersion}/reference/htmlsingle/#using-boot-devtools", "templated": true } } }, { "id": "configuration-processor", "name": "Spring Configuration Processor", "description": "Generate metadata for developers to offer contextual help and \"code completion\" when working with custom configuration keys (ex.application.properties/.yml files).", "_links": { "reference": { "href": "https://docs.spring.io/spring-boot/docs/{bootVersion}/reference/htmlsingle/#configuration-metadata-annotation-processor", "templated": true } } }] }, { "name": "Web", "values": [{ "id": "web", "name": "Spring Web", "description": "Build web, including RESTful, applications using Spring MVC. Uses Apache Tomcat as the default embedded container.", "_links": { "guide": [{ "href": "https://spring.io/guides/gs/rest-service/", "title": "Building a RESTful Web Service" }, { "href": "https://spring.io/guides/gs/serving-web-content/", "title": "Serving Web Content with Spring MVC" }, { "href": "https://spring.io/guides/tutorials/bookmarks/", "title": "Building REST services with Spring" }], "reference": { "href": "https://docs.spring.io/spring-boot/docs/{bootVersion}/reference/htmlsingle/#boot-features-developing-web-applications", "templated": true } } }, { "id": "webflux", "name": "Spring Reactive Web", "description": "Build reactive web applications with Spring WebFlux and Netty." }, { "id": "data-rest", "name": "Rest Repositories", "description": "Exposing Spring Data repositories over REST via Spring Data REST.", "_links": { "guide": [{ "href": "https://spring.io/guides/gs/accessing-data-rest/", "title": "Accessing JPA Data with REST" }, { "href": "https://spring.io/guides/gs/accessing-neo4j-data-rest/", "title": "Accessing Neo4j Data with REST" }, { "href": "https://spring.io/guides/gs/accessing-mongodb-data-rest/", "title": "Accessing MongoDB Data with REST" }], "reference": { "href": "https://docs.spring.io/spring-boot/docs/{bootVersion}/reference/htmlsingle/#howto-use-exposing-spring-data-repositories-rest-endpoint", "templated": true } } }, { "id": "session", "name": "Spring Session", "description": "Provides an API and implementations for managing user session information." }, { "id": "data-rest-hal", "name": "Rest Repositories HAL Browser", "description": "Browsing Spring Data REST repositories in your browser." }, { "id": "hateoas", "name": "Spring HATEOAS", "description": "Eases the creation of RESTful APIs that follow the HATEOAS principle when working with Spring / Spring MVC.", "_links": { "guide": { "href": "https://spring.io/guides/gs/rest-hateoas/", "title": "Building a Hypermedia-Driven RESTful Web Service" }, "reference": { "href": "https://docs.spring.io/spring-boot/docs/{bootVersion}/reference/htmlsingle/#boot-features-spring-hateoas", "templated": true } } }, { "id": "web-services", "name": "Spring Web Services", "description": "Facilitates contract-first SOAP development. Allows for the creation of flexible web services using one of the many ways to manipulate XML payloads.", "_links": { "guide": { "href": "https://spring.io/guides/gs/producing-web-service/", "title": "Producing a SOAP web service" }, "reference": { "href": "https://docs.spring.io/spring-boot/docs/{bootVersion}/reference/htmlsingle/#boot-features-webservices", "templated": true } } }, { "id": "jersey", "name": "Jersey", "description": "Framework for developing RESTful Web Services in Java that provides support for JAX-RS APIs.", "_links": { "reference": { "href": "https://docs.spring.io/spring-boot/docs/{bootVersion}/reference/htmlsingle/#boot-features-jersey", "templated": true } } }, { "id": "vaadin", "name": "Vaadin", "description": "Java framework for building rich client apps based on Web components.", "_links": { "guide": { "href": "https://spring.io/guides/gs/crud-with-vaadin/", "title": "Creating CRUD UI with Vaadin" }, "reference": { "href": "https://vaadin.com/spring" } } }] }
  ]
  constructor(private codegenService: CodegenService, public dialog: MatDialog, private router: Router) { }


  ngOnInit() {
    sessionStorage.removeItem('selectedAddon')
    sessionStorage.removeItem('addedDependencies')
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
        console.log('Error downloading the file ' + error)
      })
  }

  addonSelection(){
    let addonList = JSON.parse(sessionStorage.getItem('selectedAddon'));
    addonList.filter(addons=>{
      console.log(addons)
      if(addons == 'database'){
        this.dbScreen = true;
      }else if(addons == 'redis'){
        this.redisScreen = true
      }else if(addons == 'exception'){
        this.exceptionScreen == true
      } else if(addons == 'pipeline'){
        this.pipeScreen = true
      }
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
      console.log("length", result.data.length);
      if (result.data.length >= 1 && result.data.length != undefined) {
        result.data.forEach(result => {
          this.addDependencies.push(result);
        })

      }
      else {
        this.addDependencies.push(result.data);
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

  removeDepenency(index: number, depend) {
    console.log(" before closed====>", this.addDependencies.length);
    if (this.addDependencies.length <= 1) {
      console.log("closed====>");
      sessionStorage.removeItem('addedDependencies');
    }
    this.addDependencies.splice(index, 1);
    console.log("rmoved====>", this.addDependencies);
    console.log("depend", depend);
    if (this.addDependencies.length >= 1) {
      let addedDepend: Value[] = JSON.parse(sessionStorage.getItem('addedDependencies'));
      addedDepend.forEach(singleGroup => {
        singleGroup.values.push(depend)
      });
      sessionStorage.setItem('addedDependencies', JSON.stringify(addedDepend));
    }
  //   let addedDepend: Value[] = JSON.parse(sessionStorage.getItem('addedDependencies'));
  //   addedDepend.forEach(d =>{
  //     d.values.forEach(a =>{
  //       this.v.push(a);
  //     })
   
  //  this.v.filter(d=>{
  //     if(d.id == "jersey"){
  //     let b =  this.v.findIndex(d => d.id == "jersey")
  //     console.log("inexxxxx", b);
  //     }
  //   }) 
     
  //  })
   

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
    sessionStorage.removeItem('addedDependencies')
    this.prev = this.current++;
    if(this.current == 3){
      this.addonSelection();
    }
    sessionStorage.setItem('currentScreen',this.current.toString())
  }
  onskip() {
    this.prev = this.current++;
  }
  isLeftTransition(idx: number): boolean {
    return this.current === idx ? this.prev > this.current : this.prev < this.current;
  }
  getCheckedLanguage(language: string) {
    console.log("language checked ==>", language);
    if (language == "java") {
      this.hideBootVersion = true;
    } else {
      this.hideBootVersion = false;
    }
  }
}
