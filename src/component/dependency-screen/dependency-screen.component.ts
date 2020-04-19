import { Component, OnInit } from '@angular/core';
import { CodegenService } from 'src/_service/codegen.service';
import { Dependencies } from 'src/_model/dependencies';
import { Value } from 'src/_model/value';

@Component({
  selector: 'app-dependency-screen',
  templateUrl: './dependency-screen.component.html',
  styleUrls: ['./dependency-screen.component.css']
})
export class DependencyScreenComponent implements OnInit {
  dependencies : Value[];
  searchValue:string;
  constructor(private codegenService : CodegenService) { }

  ngOnInit() {

    let response = localStorage.getItem('responseBody');
    let parsedResponse = JSON.parse(response);
    this.dependencies = parsedResponse.dependencies.values;
  
  }

}
