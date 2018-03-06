import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonImportsModule } from '../common-imports/common-imports.module';
import { RouterModule } from '@angular/router';
import { PersonRoutes } from './person.routing';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { MensajeriaComponent } from '../../components/mensajeria/mensajeria/mensajeria.component';
import { MensajeriaFormComponent } from '../../components/mensajeria/mensajeria-form/mensajeria-form.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    CommonImportsModule,
    MaterialModule,
    RouterModule.forChild(PersonRoutes),
    SharedComponentsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google.maps
    }),
  ],
  declarations: [

  ]
})
export class PersonModule { }
