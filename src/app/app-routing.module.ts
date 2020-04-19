import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{JavaScreenComponent} from 'src/component/java-screen/java-screen.component'
const routes: Routes = [{
  path:'javamain',
  component: JavaScreenComponent
}];

@NgModule({
   imports: [
      RouterModule.forRoot(routes)
   ],
   exports: [
      RouterModule
   ],
   declarations: [
   ]
})
export class AppRoutingModule { }
