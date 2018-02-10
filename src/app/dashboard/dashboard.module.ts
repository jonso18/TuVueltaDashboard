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

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        ReactiveFormsModule,
        MdModule,
        MaterialModule,
        HttpClientModule,
        NgHttpLoaderModule
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
        DialogDeleteCity
    ],
    entryComponents:[
        DialogNewCity,
        DialogDeleteCity
    ]
})

export class DashboardModule { }
