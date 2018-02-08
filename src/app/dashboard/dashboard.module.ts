import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { SolicitudComponent } from '../solicitudes/solicitud/solicitud.component';
import { SolicitudFormComponent } from '../solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from '../solicitudes/solicitud-list/solicitud-list.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MdModule,
        MaterialModule,
        ReactiveFormsModule
    ],
    declarations: [DashboardComponent, SolicitudComponent, SolicitudFormComponent, SolicitudListComponent]
})

export class DashboardModule {}
