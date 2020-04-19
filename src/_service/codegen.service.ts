import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseDto } from 'src/_model/responseDto';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CodegenService { 

  client_Url = "http://localhost:8080/metadata/client";
  demo  = "http://localhost:5000/response"

  constructor(private http : HttpClient) { }

  getResponse(codeGen):Observable<any>{
    let params = this.getParams(codeGen);
    return this.http.get('http://localhost:8080/starter.zip',
    {params, responseType: 'arraybuffer' as 'json'});
  }

  getParams(codeGen):HttpParams{
    let params = new HttpParams()
    .set('type', codeGen.project)
    .set('language', codeGen.language)
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
    console.log('Params -> '+params.toString())
    return params;
  }

  getClient():Observable<ResponseDto>
  {
    console.log("Inside Client Call")
    return this.http.get<ResponseDto>(this.demo).pipe(map(response=>{
      localStorage.setItem('responseBody',JSON.stringify(response))
             return response;
        
    }))

}
}
