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
import { ReportesComponent } from '../reportes/reportes/reportes.component';
import { ReporteClientesServiciosComponent } from '../reportes/reporte-clientes/reporte-clientes-servicios/reporte-clientes-servicios.component';
import { MensajeriaComponent } from '../mensajeria/mensajeria/mensajeria.component';
import { MensajeriaFormComponent } from '../mensajeria/mensajeria-form/mensajeria-form.component';
import { ConfigGlobalComponent } from '../parametros/config-global/config-global.component';
import { UsuariosComponent } from '../usuarios/usuarios/usuarios.component';
import { UsuarioFormComponent } from '../usuarios/usuario-form/usuario-form.component';

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
                            },
                            {
                                path: 'Configuracion-global',
                                component: ConfigGlobalComponent
                            }
                        ]
                    },
                    {
                        path:'Usuarios',
                        component: UsuariosComponent,
                        children:[
                            {
                                path:'',
                                redirectTo: 'nuevo',
                                pathMatch: 'full'
                            },
                            {
                                path: 'nuevo',
                                component: UsuarioFormComponent
                            }
                        ]
                    },
                    {
                        path:'reportes',
                        component: ReportesComponent,
                        children:[
                            {
                                path:'',
                                redirectTo: 'clientes-servicios',
                                pathMatch: 'full'
                            },
                            {
                                path: 'clientes-servicios',
                                component: ReporteClientesServiciosComponent
                            }
                        ]
                    },
                    {
                        path: 'mensajeria',
                        component: MensajeriaComponent,
                        children: [
                            {
                                path: '',
                                redirectTo: 'nuevo',
                                pathMatch: 'full'
                            },
                            {
                                path:'nuevo',
                                component: MensajeriaFormComponent
                            }
                        ]
                    }
                    
                ]
            }
            
        ]
    }
];
