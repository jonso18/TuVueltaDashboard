import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { SolicitudComponent } from '../solicitudes/solicitud/solicitud.component';
import { SolicitudFormComponent, SolicitudFormDialog } from '../solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from '../solicitudes/solicitud-list/solicitud-list.component';
import { HttpClientModule } from '@angular/common/http';
import { DbService } from '../services/db/db.service';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { ReglasActivosComponent } from '../parametros/reglas-activos/reglas-activos.component';
import { EquipamientoComponent } from '../parametros/equipamiento/equipamiento.component';
import { EstadosDomiciliosComponent } from '../parametros/estados-domicilios/estados-domicilios.component';
import { GananciasComponent } from '../parametros/ganancias/ganancias.component';
import { TarifasComponent } from '../parametros/tarifas/tarifas.component';
import { CiudadesComponent, DialogNewCity, DialogDeleteCity } from '../parametros/ciudades/ciudades.component';
import { ParametrosComponent } from '../parametros/parametros/parametros.component';
import { ReasignacionComponent, DialogReasignacion } from '../solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { ReportesComponent } from '../reportes/reportes/reportes.component';
import { ReporteClientesServiciosComponent } from '../reportes/reporte-clientes/reporte-clientes-servicios/reporte-clientes-servicios.component';
import { MensajeriaFormComponent, DialogOnClickMap } from '../mensajeria/mensajeria-form/mensajeria-form.component';
import { MensajeriaComponent } from '../mensajeria/mensajeria/mensajeria.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { ConfigGlobalComponent } from '../parametros/config-global/config-global.component';
import { UsuarioFormComponent } from '../usuarios/usuario-form/usuario-form.component';
import { UsuariosComponent } from '../usuarios/usuarios/usuarios.component';
import { UsuariosListComponent } from '../usuarios/usuarios-list/usuarios-list.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        ReactiveFormsModule,
        MdModule,
        MaterialModule,
        HttpClientModule,
        NgHttpLoaderModule,
        AgmCoreModule.forRoot({
            apiKey: environment.google.maps
        })
    ],

    declarations: [
        DashboardComponent,
        SolicitudComponent,
        SolicitudFormComponent,
        SolicitudListComponent,
        ParametrosComponent,
        CiudadesComponent,
        TarifasComponent,
        GananciasComponent,
        EstadosDomiciliosComponent,
        EquipamientoComponent,
        ReglasActivosComponent,
        DialogNewCity,
        DialogDeleteCity,
        ReasignacionComponent,
        DialogReasignacion,
        ReporteClientesServiciosComponent,
        ReportesComponent,
        SolicitudFormDialog,
        MensajeriaFormComponent,
        MensajeriaComponent,
        DialogOnClickMap,
        ConfigGlobalComponent,
        UsuarioFormComponent,
        UsuariosComponent,
        UsuariosListComponent
    ],
    entryComponents: [
        DialogNewCity,
        DialogDeleteCity,
        DialogReasignacion,
        SolicitudFormDialog,
        DialogOnClickMap
    ]
})

export class DashboardModule { }
