import { Routes } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { SolicitudComponent } from '../../components/solicitudes/solicitud/solicitud.component';
import { SolicitudFormComponent } from '../../components/solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from '../../components/solicitudes/solicitud-list/solicitud-list.component';
import { ParametrosComponent } from '../../components/parametros/parametros/parametros.component';
import { CiudadesComponent } from '../../components/parametros/ciudades/ciudades.component';
import { TarifasComponent } from '../../components/parametros/tarifas/tarifas.component';
import { GananciasComponent } from '../../components/parametros/ganancias/ganancias.component';
import { EstadosDomiciliosComponent } from '../../components/parametros/estados-domicilios/estados-domicilios.component';
import { EquipamientoComponent } from '../../components/parametros/equipamiento/equipamiento.component';
import { ReglasActivosComponent } from '../../components/parametros/reglas-activos/reglas-activos.component';
import { ReasignacionComponent } from '../../components/solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { ReportesComponent } from '../../components/reportes/reportes/reportes.component';
import { ReporteClientesServiciosComponent } from '../../components/reportes/reporte-clientes/reporte-clientes-servicios/reporte-clientes-servicios.component';
import { MensajeriaComponent } from '../../components/mensajeria/mensajeria/mensajeria.component';
import { MensajeriaFormComponent } from '../../components/mensajeria/mensajeria-form/mensajeria-form.component';
import { ConfigGlobalComponent } from '../../components/parametros/config-global/config-global.component';
import { UsuariosComponent } from '../../components/usuarios/usuarios/usuarios.component';
import { UsuarioFormComponent } from '../../components/usuarios/usuario-form/usuario-form.component';
import { UsuariosListComponent } from '../../components/usuarios/usuarios-list/usuarios-list.component';
import { SeguimientoActivosComponent } from '../../components/usuarios/seguimiento-activos/seguimiento-activos.component';

import { EstadodecuentaComponent } from '../../components/usuarios/estadodecuenta/estadodecuenta.component';
import { TransaccionesComponent } from '../../components/solicitudes/transacciones/transacciones.component';
import { MensajeriaFormDetailsComponent } from '../../components/mensajeria/mensajeria-form/mensajeria-form-details/mensajeria-form-details.component';
import { BonosMensajeriaComponent } from '../../components/parametros/bonos-mensajeria/bonos-mensajeria.component';
import { IdTerNoPerComponent } from '../../components/parametros/id-ter-no-per/id-ter-no-per.component';

export const AdminRoutes: Routes = [
    {
        path: '',
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
        children: [
            {
                path: '',
                component: SolicitudListComponent
            },
            {
                path: 'lista',
                redirectTo: '',
                pathMatch: 'full'
            },
            {
                path: 'nueva',
                component: SolicitudFormComponent
            },
            {
                path: 'hacer-reasignacion',
                component: ReasignacionComponent
            },
            {
                path: ':id',
                children: [
                    {
                        path:'',
                        redirectTo: 'transacciones',
                        pathMatch: 'full'
                    },
                    {
                        path: 'transacciones',
                        component: TransaccionesComponent
                    }
                ]
            },
        ]
    },
    {
        path: 'parametros',
        component: ParametrosComponent,
        children: [
            {
                path: 'Configuracion-global',
                component: ConfigGlobalComponent
            },
            {
                path: '',
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
                path: 'Bonos-Mensajeria',
                component: BonosMensajeriaComponent
            },
            {
                path: 'Terceros-No-Permitidos',
                component: IdTerNoPerComponent
            }
        ]
    },
    {
        path: 'Usuarios',
        component: UsuariosComponent,
        children: [
            {
                path: '',
                component: UsuariosListComponent
            },
            {
                path: 'lista',
                redirectTo: '',
                pathMatch: 'full'
            },
            {
                path: 'seguimiento-activos',
                component: SeguimientoActivosComponent
            },
            {
                path: 'nuevo',
                component: UsuarioFormComponent,
                outlet: 'nuevo-usuario'
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        redirectTo: 'Actualizar',
                        pathMatch: 'full'
                    },
                    {
                        path: 'Actualizar',
                        component: UsuarioFormComponent
                    },
                    {
                        path: 'Estadodecuenta',
                        component: EstadodecuentaComponent
                    }
                ]
            },
        ]
    },
    {
        path: 'reportes',
        component: ReportesComponent,
        children: [
            {
                path: '',
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
                path: 'nuevo',
                component: MensajeriaFormComponent
            }
        ]
    },
    {
        path: 'desarrollo',
        component: MensajeriaFormDetailsComponent
    }
];
