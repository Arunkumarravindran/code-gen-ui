import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ResponseDto } from 'src/_model/responseDto';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { DbValues } from 'src/_model/dbValues';
import { DbFormValues } from 'src/_model/DbFormValues';
@Injectable({
  providedIn: 'root'
})
export class CodegenService {

  durationInSeconds = 5;

  client_Url = "http://localhost:8080/metadata/client";
  download_Url = "http://localhost:8080/starter.zip";
  testDownload_Url = "https://73cfab67.ngrok.io/starter.zip"
  testClient_Url = "https://7fff902b.ngrok.io/metadata/client"
  dbDetails_Url = "https://7fff902b.ngrok.io/getHibernateValues"


  constructor(private http: HttpClient,
    public snackBar: MatSnackBar,
    private errorService: ErrorService,
    private router: Router) { }

  getResponse(codeGen): Observable<any> {
    let params = this.getParams(codeGen);
    console.log('Params -> ' + params.toString())
    return this.http.get(this.testDownload_Url,
      { params, responseType: 'arraybuffer' as 'json' }).pipe(catchError(this.handleError))
  }

  getFileName(codeGen): Observable<any> {
    let params = this.getParams(codeGen);
    return this.http.get(this.testDownload_Url,
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
    return this.http.get<ResponseDto>(this.testClient_Url).pipe(map(response => {
      localStorage.setItem('responseBody', JSON.stringify(response)), (catchError(this.handleError_Client))

      return response;

    }))

  }

  getDbScreenDetails(dbType): Observable<DbValues>{
    let params = new HttpParams()
      .set('dbType',dbType)
    return this.http.get<DbValues>(this.dbDetails_Url,{params}).pipe(map(response => {
      console.log("inside srvice===>",response);
      
      return response;
    }))
  }
 sendDbDetails(reqBody:DbFormValues){
   return this.http.post(this.dbDetails_Url,reqBody)
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



