import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ResponseDto } from 'src/_model/responseDto';
import { Dependencies } from 'src/_model/dependencies';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { DbValues } from 'src/_model/dbValues';
import { DbFormValues } from 'src/_model/DbFormValues';
import { EnvLogFormValues } from 'src/_model/envLogFormValues';
import { EnvConf } from 'src/_model/envConf';
@Injectable({
  providedIn: 'root'
})
export class CodegenService {

  durationInSeconds = 5;

  client_Url = "http://localhost:8080/metadata/client";
  //testClient_Url = " https://d11572f3.ngrok.io/metadata/client"

  download_Url = "http://localhost:8080/starter.zip";
  //testDownload_Url = " https://d11572f3.ngrok.io/starter.zip"

  dbDetails_Url = "http://localhost:8080/getHibernateValues"
  //testdbDetails_Url = " https://d11572f3.ngrok.io/getHibernateValues"

  sendDbDetails_Url = " http://localhost:8080/writeDBValues"
  //testsendDbDetails_Url = " https://d11572f3.ngrok.io/writeDBValues"

  logBack_Url = "http://localhost:8080/logback"
  testlogBack_Url = "https://d11572f3.ngrok.io/logback"

  nexus_dep_url = "http://localhost:8080/nexusSetup"


  constructor(private http: HttpClient,
    public snackBar: MatSnackBar,
    private errorService: ErrorService,
    private router: Router) { }

  getResponse(codeGen): Observable<any> {
    let params = this.getParams(codeGen);
    console.log('Params -> ' + params.toString())
    return this.http.get(this.client_Url,
      { params, responseType: 'arraybuffer' as 'json' }).pipe(catchError(this.handleError))
  }

  getFileName(codeGen): Observable<any> {
    let params = this.getParams(codeGen);
    return this.http.get(this.download_Url,
      { params, responseType: 'arraybuffer' as 'json', observe: 'response' }).pipe(catchError(this.handleError))
  }

  getParams(codeGen): HttpParams {

    let params = new HttpParams()
      .set('type', codeGen.projectName)
      .set('language', codeGen.languageType)
      .set('bootVersion', codeGen.bootVersion)
      .set('baseDir', codeGen.artifact)
      .set('groupId', codeGen.group)
      .set('artifactId', codeGen.artifact)
      .set('name', codeGen.name)
      .set('description', codeGen.description)
      .set('packageName', codeGen.packageName)
      .set('packaging', codeGen.packaging)
      .set('javaVersion', codeGen.java)
      .set('dependencies', codeGen.dependencies)
    return params;
  }

  getClient(): Observable<ResponseDto> {
    console.log("Inside Client Call")
    return this.http.get<ResponseDto>(this.client_Url).pipe(map(response => {
      localStorage.setItem('responseBody', JSON.stringify(response)), (catchError(this.handleError_Client))
      return response;
    }))

  }

  getNexusDependencies(): Observable<Dependencies> {
    console.log("Inside nexus Call")
    return this.http.get<Dependencies>(this.nexus_dep_url).pipe(map(response => {
      localStorage.setItem('nexus_dep', JSON.stringify(response)), (catchError(this.handleError_Client))
      return response;
    }))

  }

  getDbScreenDetails(dbType): Observable<DbValues> {
    let params = new HttpParams()
      .set('dbType', dbType)
    return this.http.get<DbValues>(this.dbDetails_Url, { params }).pipe(map(response => {
      console.log("inside srvice===>", response);

      return response;
    }))
  }
  sendDbDetails(reqBody: DbFormValues) {
    console.log("finalStruc==>", reqBody)
    return this.http.post<DbFormValues>(this.sendDbDetails_Url, reqBody).pipe(map(responseBody => {
      console.log("insde service call");

      return "success";
    }));
  }
  sendLogbackDetails(reqBody: EnvConf) {
    console.log("logStructure==>", reqBody)
    return this.http.post<EnvConf>(this.logBack_Url, reqBody).pipe(map(responseBody => {
      console.log("insde service call");

      return "successssssssssssssssssssss";
    }));
  }
  handleError = (error: HttpErrorResponse) => {
    console.log('server side', error.status)
    this.errorService.open(error.status)
    return throwError(error);
  }

  handleError_Client = (error: HttpErrorResponse) => {
    console.log('server side', error.status)
    this.router.navigate(['/first'])
    this.errorService.open(error.status)
    return throwError(error);
  }



}



