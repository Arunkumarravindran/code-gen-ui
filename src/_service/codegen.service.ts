import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ResponseDto } from 'src/_model/responseDto';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';
import { CustomResponseDto } from 'src/_model/CustomResponseDto';
@Injectable({
  providedIn: 'root'
})
export class CodegenService {


  client_Url = "http://localhost:8080/metadata/client";
  custom_client_url = "http://localhost:8080/custom/metadata/client";
  custom_download_Url = "http://localhost:8080/custom/starter.zip";


  constructor(private http: HttpClient,
    public snackBar: MatSnackBar,
    private errorService: ErrorService,
    private router: Router) { }

  getResponse(codeGen): Observable<any> {
    return this.http.post(this.custom_download_Url,this.getRequestBody(codeGen),
    { responseType: 'arraybuffer' as 'json' }).pipe(catchError(this.handleError))
      //{ responseType: 'arraybuffer' as 'json' }
  }

  private getRequestBody(codeGen): any {
    let dependenciesValues :String[];
    let dependency:String = codeGen.dependencies;
    if(dependency == null || dependency == ""){
      dependenciesValues = [];
    }else{
      dependenciesValues = dependency.split(",");
      dependenciesValues.forEach((item, index) => {
        if (item === "") dependenciesValues.splice(index, 1);
      });
    }
    if(sessionStorage.getItem("swaggerItem")){
      dependenciesValues.push(sessionStorage.getItem("swaggerItem"));
    }
    return  {
      'type': codeGen.projectName,
      'language': codeGen.languageType,
      'bootVersion': codeGen.bootVersion,
      'baseDir': codeGen.artifact,
      'groupId': codeGen.group,
      'artifactId': codeGen.artifact,
      'name': codeGen.name,
      'description': codeGen.description,
      'packageName': codeGen.packageName,
      'packaging': codeGen.packaging,
      'javaVersion': codeGen.java,
      'dependencies': dependenciesValues,
      'envRequest':JSON.parse(sessionStorage.getItem('envDetails')),
      'dbRequest':JSON.parse(sessionStorage.getItem('dbFormValue')),
      'jenkinRequest':JSON.parse(sessionStorage.getItem('pipelineJenkinsFormGroupValue')),
      'kubernetesRequest':JSON.parse(sessionStorage.getItem('pipelineKubernetesFormGroupValue'))
    }
  }


  getClient(): Observable<ResponseDto> {
    console.log("Inside Client Call")
    return this.http.get<ResponseDto>(this.client_Url).pipe(map(response => {
      localStorage.setItem('responseBody', JSON.stringify(response)), (catchError(this.handleError_Client))
      return response;
    }))

  }

  getCustomClient(): Observable<CustomResponseDto> {
    console.log("Inside custom client Call")
    return this.http.get<CustomResponseDto>(this.custom_client_url).pipe(map(response => {
      localStorage.setItem('customResponseBody', JSON.stringify(response)), (catchError(this.handleError_Client));
      localStorage.setItem('customDbDetails', JSON.stringify(response.dbDetails)), (catchError(this.handleError_Client));
      localStorage.setItem('customAddOns', JSON.stringify(response.addOns)), (catchError(this.handleError_Client));
      return response;
    }))

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



