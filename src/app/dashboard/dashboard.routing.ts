import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { SolicitudComponent } from '../solicitudes/solicitud/solicitud.component';
import { SolicitudFormComponent } from '../solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from '../solicitudes/solicitud-list/solicitud-list.component';
import { ParametrosComponent } from '../parametros/parametros/parametros.component';
import { CiudadesComponent } from '../parametros/ciudades/ciudades.component';
import { TarifasComponent } from '../parametros/tarifas/tarifas.component';
import { GananciasComponent } from '../parametros/ganancias/ganancias.component';
import { EstadosDomiciliosComponent } from '../parametros/estados-domicilios/estados-domicilios.component';
import { EquipamientoComponent } from '../parametros/equipamiento/equipamiento.component';
import { ReglasActivosComponent } from '../parametros/reglas-activos/reglas-activos.component';
import { ReasignacionComponent } from '../solicitudes/reasignaciones/reasignacion/reasignacion.component';

export const DashboardRoutes: Routes = [
    {

        path: '',
        children: [
            {
                path: 'dashboard',
                children: [
                    {
                        path:'',
                        redirectTo: 'inicio',
                        pathMatch: 'full'
                    },
                    {
                        path: 'inicio',
                        component: DashboardComponent
                    },
                    {
                        path: 'solicitud',
                        component: SolicitudComponent,
                        children:[
                            {
                                path:'',
                                redirectTo: 'lista',
                                pathMatch: 'full'
                            },
                            {
                                path: 'nueva',
                                component: SolicitudFormComponent
                            },
                            {
                                path: 'lista',
                                component: SolicitudListComponent
                            },
                            {
                                path: 'hacer-reasignacion',
                                component: ReasignacionComponent
                            }
                        ]
                    },
                    {
                        path:'parametros',
                        component: ParametrosComponent,
                        children:[
                            {
                                path:'',
                                redirectTo: 'ciudad',
                                pathMatch: 'full'
                            },
                            {
                                path: 'ciudad',
                                component: CiudadesComponent
                            },
                            {
                                path: 'tarifas',
                                component: TarifasComponent
                            },
                            {
                                path: 'Ganacias',
                                component: GananciasComponent
                            },
                            {
                                path: 'Estados-Domicilios',
                                component: EstadosDomiciliosComponent
                            },
                            {
                                path: 'Equipamiento',
                                component: EquipamientoComponent
                            },
                            {
                                path: 'Reglas-activo',
                                component: ReglasActivosComponent
                            }
                        ]
                    }
                    
                ]
            }
            
        ]
    }
];
