import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{JavaScreenComponent} from 'src/component/java-screen/java-screen.component'

import { FirstComponent } from 'src/component/first/first.component';
import { FileExplorerScreenComponent } from 'src/component/fileExplorer-Screen/fileExplorer-Screen.component';
const routes: Routes = [
   {
      path:'javaMain',
      component: JavaScreenComponent
   },
   {
      path:'homeScreen',
      component: FirstComponent
   },
   {
      path:'explore',
      component: FileExplorerScreenComponent
   },
   {
      path :'**',
      redirectTo:'homeScreen',
      pathMatch:'full'
   }
];

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
