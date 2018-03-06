import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../../components/md/md.module';


import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { SolicitudComponent } from '../../components/solicitudes/solicitud/solicitud.component';
import { SolicitudFormComponent, SolicitudFormDialog } from '../../components/solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from '../../components/solicitudes/solicitud-list/solicitud-list.component';
import { HttpClientModule } from '@angular/common/http';
import { DbService } from '../../services/db/db.service';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { ReglasActivosComponent } from '../../components/parametros/reglas-activos/reglas-activos.component';
import { EquipamientoComponent } from '../../components/parametros/equipamiento/equipamiento.component';
import { EstadosDomiciliosComponent } from '../../components/parametros/estados-domicilios/estados-domicilios.component';
import { GananciasComponent } from '../../components/parametros/ganancias/ganancias.component';
import { TarifasComponent } from '../../components/parametros/tarifas/tarifas.component';
import { CiudadesComponent, DialogNewCity, DialogDeleteCity } from '../../components/parametros/ciudades/ciudades.component';
import { ParametrosComponent } from '../../components/parametros/parametros/parametros.component';
import { ReasignacionComponent, DialogReasignacion } from '../../components/solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { ReportesComponent } from '../../components/reportes/reportes/reportes.component';
import { ReporteClientesServiciosComponent } from '../../components/reportes/reporte-clientes/reporte-clientes-servicios/reporte-clientes-servicios.component';
import { MensajeriaFormComponent, DialogOnClickMap } from '../../components/mensajeria/mensajeria-form/mensajeria-form.component';
import { MensajeriaComponent } from '../../components/mensajeria/mensajeria/mensajeria.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../../environments/environment';
import { ConfigGlobalComponent } from '../../components/parametros/config-global/config-global.component';
import { UsuarioFormComponent } from '../../components/usuarios/usuario-form/usuario-form.component';
import { UsuariosComponent } from '../../components/usuarios/usuarios/usuarios.component';
import { UsuariosListComponent } from '../../components/usuarios/usuarios-list/usuarios-list.component';
import { SeguimientoActivosComponent } from '../../components/usuarios/seguimiento-activos/seguimiento-activos.component';
import { RelanzamientosComponent } from '../../components/usuarios/relanzamientos/relanzamientos.component';
import { EstadodecuentaComponent } from '../../components/usuarios/estadodecuenta/estadodecuenta.component';
import { RetirosComponent } from '../../components/usuarios/retiros/retiros.component';
import { LogEquipamientoComponent } from '../../components/usuarios/log-equipamiento/log-equipamiento.component';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { TransaccionesComponent } from '../../components/solicitudes/transacciones/transacciones.component';
import { ComprarServicioComponent } from '../../components/solicitudes/comprar-servicio/comprar-servicio.component';
import { DataTransaccionServicioComponent } from '../../components/solicitudes/data-transaccion-servicio/data-transaccion-servicio.component';
import { CambiarEstadoServicioComponent } from '../../components/solicitudes/cambiar-estado-servicio/cambiar-estado-servicio.component';
import { NoRetirementCreditDialogComponent } from '../../dialogs/no-retirement-credit-dialog/no-retirement-credit-dialog.component';
import { MaterialModule } from '../../modules/material/material.module';
import { CommonImportsModule } from '../../modules/common-imports/common-imports.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
    imports: [

    ],
    declarations: [
  
    ],
    entryComponents: [

    ]
})

export class DashboardModule { }
