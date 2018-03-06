import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MensajeriaFormComponent, DialogOnClickMap } from '../../components/mensajeria/mensajeria-form/mensajeria-form.component';
import { MensajeriaComponent } from '../../components/mensajeria/mensajeria/mensajeria.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../environments/environment';
import { CommonImportsModule } from '../common-imports/common-imports.module';
import { SolicitudComponent } from '../../components/solicitudes/solicitud/solicitud.component';
import { SolicitudFormComponent } from '../../components/solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from '../../components/solicitudes/solicitud-list/solicitud-list.component';
import { ReasignacionComponent } from '../../components/solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { TransaccionesComponent } from '../../components/solicitudes/transacciones/transacciones.component';
import { ComprarServicioComponent } from '../../components/solicitudes/comprar-servicio/comprar-servicio.component';
import { CambiarEstadoServicioComponent } from '../../components/solicitudes/cambiar-estado-servicio/cambiar-estado-servicio.component';
import { DataTransaccionServicioComponent } from '../../components/solicitudes/data-transaccion-servicio/data-transaccion-servicio.component';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';

@NgModule({
  imports: [
    CommonModule,
    CommonImportsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google.maps
    }),
  ],
  declarations: [
    DashboardComponent,
    MensajeriaComponent,
    MensajeriaFormComponent,
    SolicitudComponent,
    SolicitudFormComponent,
    SolicitudListComponent,
    ReasignacionComponent,
    TransaccionesComponent,
    ComprarServicioComponent,
    DataTransaccionServicioComponent,
    CambiarEstadoServicioComponent,
    DialogOnClickMap,
    ConfirmationComponent,
  ],
  entryComponents: [
    DialogOnClickMap,
    ConfirmationComponent,
  ],
  exports: [
    DashboardComponent,
    MensajeriaComponent,
    MensajeriaFormComponent,
    SolicitudComponent,
    SolicitudFormComponent,
    SolicitudListComponent,
    ReasignacionComponent,
    TransaccionesComponent,
    ComprarServicioComponent,
    DataTransaccionServicioComponent,
    CambiarEstadoServicioComponent,
  ]
})
export class SharedComponentsModule { }
