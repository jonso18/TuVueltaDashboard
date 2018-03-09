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
import { ParametrosComponent } from '../../components/parametros/parametros/parametros.component';
import { CiudadesComponent, DialogNewCity, DialogDeleteCity } from '../../components/parametros/ciudades/ciudades.component';
import { TarifasComponent } from '../../components/parametros/tarifas/tarifas.component';
import { GananciasComponent } from '../../components/parametros/ganancias/ganancias.component';
import { EstadosDomiciliosComponent } from '../../components/parametros/estados-domicilios/estados-domicilios.component';
import { EquipamientoComponent } from '../../components/parametros/equipamiento/equipamiento.component';
import { ReglasActivosComponent } from '../../components/parametros/reglas-activos/reglas-activos.component';
import { DialogReasignacion } from '../../components/solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { SolicitudFormDialog } from '../../components/solicitudes/solicitud-form/solicitud-form.component';
import { ConfigGlobalComponent } from '../../components/parametros/config-global/config-global.component';
import { UsuarioFormComponent } from '../../components/usuarios/usuario-form/usuario-form.component';
import { UsuariosComponent } from '../../components/usuarios/usuarios/usuarios.component';
import { UsuariosListComponent } from '../../components/usuarios/usuarios-list/usuarios-list.component';
import { RelanzamientosComponent } from '../../components/usuarios/relanzamientos/relanzamientos.component';
import { EstadodecuentaComponent } from '../../components/usuarios/estadodecuenta/estadodecuenta.component';
import { RetirosComponent } from '../../components/usuarios/retiros/retiros.component';
import { NoRetirementCreditDialogComponent } from '../../dialogs/no-retirement-credit-dialog/no-retirement-credit-dialog.component';
import { SeguimientoActivosComponent } from '../../components/usuarios/seguimiento-activos/seguimiento-activos.component';
import { LogEquipamientoComponent } from '../../components/usuarios/log-equipamiento/log-equipamiento.component';
import { MensajeriaFormDetailsComponent } from '../../components/mensajeria/mensajeria-form/mensajeria-form-details/mensajeria-form-details.component';
@NgModule({
  imports: [
    CommonModule,
    CommonImportsModule,
    AgmCoreModule,
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
    
    ParametrosComponent,
    CiudadesComponent,
    TarifasComponent,
    GananciasComponent,
    EstadosDomiciliosComponent,
    EquipamientoComponent,
    ReglasActivosComponent,
    DialogNewCity,
    DialogDeleteCity,
    DialogReasignacion,
    
    SolicitudFormDialog,
    ConfigGlobalComponent,
    UsuarioFormComponent,
    UsuariosComponent,
    UsuariosListComponent,
    
    RelanzamientosComponent,
    EstadodecuentaComponent,
    RetirosComponent,
    LogEquipamientoComponent,
    NoRetirementCreditDialogComponent,
    SeguimientoActivosComponent,
    MensajeriaFormDetailsComponent
  ],
  entryComponents: [
    DialogOnClickMap,
    ConfirmationComponent,
    DialogNewCity,
    DialogDeleteCity,
    DialogReasignacion,
    SolicitudFormDialog,
    NoRetirementCreditDialogComponent
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
