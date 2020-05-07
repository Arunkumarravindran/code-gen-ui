import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JavaScreenComponent } from 'src/component/java-screen/java-screen.component';
import { DependencyScreenComponent } from 'src/component/dependency-screen/dependency-screen.component'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from "@angular/common/http";
import { MatRadioModule } from '@angular/material/radio';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { DependencySearchPipe } from 'src/_pipe/dependencySearch.pipe'
import { FirstComponent } from 'src/component/first/first.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { FileExplorerScreenComponent } from 'src/component/fileExplorer-Screen/fileExplorer-Screen.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HighlightJsModule } from 'ngx-highlight-js';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataBaseComponent } from 'src/component/dataBase/dataBase.component';
import { GoCdScreenComponent } from 'src/component/pipeLine/goCd-Screen/goCd-Screen.component';
import { JenkinsScreenComponent } from 'src/component/pipeLine/jenkins-Screen/jenkins-Screen.component';
import { PipeLineComponent } from 'src/component/pipeLine/pipeLine.component';
import {MatSelectModule} from '@angular/material/select';
import {MatRippleModule} from '@angular/material/core';
import { PageSliderComponent } from 'src/component/pageSlider/pageSlider.component';
import { AnimationService } from 'src/assets/animation.service';
import { AddOnScreenComponent } from 'src/component/add-on-screen/add-on-screen.component';

@NgModule({
   declarations: [
      AppComponent,
      JavaScreenComponent,
      DependencyScreenComponent,
      DependencySearchPipe,
      FirstComponent,
      FileExplorerScreenComponent,
      DataBaseComponent,
      GoCdScreenComponent,
      JenkinsScreenComponent,
      PipeLineComponent,
      PageSliderComponent,
      AddOnScreenComponent
   ],
   entryComponents: [
      DependencyScreenComponent,
      FileExplorerScreenComponent
   ],
   imports: [
      BrowserModule,
      MatListModule,
      MatRippleModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      FormsModule,
      MatGridListModule,
      ReactiveFormsModule,
      MatSelectModule,
      MatToolbarModule,
      MatSidenavModule,
      MatIconModule,
      MatCardModule,
      MatTooltipModule,
      MatDialogModule,
      MatCheckboxModule,
      MatFormFieldModule,
      HighlightJsModule,
      MatInputModule,
      MatButtonModule,
      HttpClientModule,
      MatRadioModule,
      MatTreeModule,
      MatExpansionModule,
      MatSnackBarModule,
      MatDividerModule,
   ],
   providers: [AnimationService],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
