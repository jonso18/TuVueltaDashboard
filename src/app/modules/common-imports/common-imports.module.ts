import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    FormsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgHttpLoaderModule,
    RouterModule,
  ],
  exports: [
    FormsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgHttpLoaderModule,
    RouterModule
  ]
})
export class CommonImportsModule { }
