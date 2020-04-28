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
@NgModule({
   declarations: [
      AppComponent,
      JavaScreenComponent,
      DependencyScreenComponent,
      DependencySearchPipe,
      FirstComponent,
      FileExplorerScreenComponent
   ],
   entryComponents: [
      DependencyScreenComponent,
      FileExplorerScreenComponent
   ],
   imports: [
      BrowserModule,
      MatListModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
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
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
