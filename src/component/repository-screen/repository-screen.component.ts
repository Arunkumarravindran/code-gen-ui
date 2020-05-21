import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-repository-screen',
  templateUrl: './repository-screen.component.html',
  styleUrls: ['./repository-screen.component.css']
})
export class RepositoryScreenComponent implements OnInit {

  constructor(private router:Router) {

    
   }

   redirectJavaFromPrivate()
  {
    this.router.navigate(['/javaMain', {id: "private"}])
  }
  redirectJavaFromPublic()
  {
    this.router.navigate(['/javaMain', {id: "public"}])
  }

  ngOnInit(): void {
  }

}
