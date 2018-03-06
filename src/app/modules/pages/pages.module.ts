import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { MdIconModule, MdCardModule, MdInputModule, MdCheckboxModule, MdButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FlexLayoutModule } from '@angular/flex-layout';

import { PagesRoutes } from './pages.routing';

import { RegisterComponent } from '../../components/pages/register/register.component';
import { PricingComponent } from '../../components/pages/pricing/pricing.component';
import { LockComponent } from '../../components/pages/lock/lock.component';
import { LoginComponent } from '../../components/pages/login/login.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    PricingComponent,
    LockComponent
  ]
})

export class PagesModule {}
