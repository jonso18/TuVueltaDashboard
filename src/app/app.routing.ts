import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './components/layouts/auth/auth-layout.component';
import { AuthGuardService } from './services/auth-guard.service';

import { ReportesComponent } from './components/reportes/reportes/reportes.component';
import { ReporteClientesServiciosComponent } from './components/reportes/reporte-clientes/reporte-clientes-servicios/reporte-clientes-servicios.component';
import { MensajeriaComponent } from './components/mensajeria/mensajeria/mensajeria.component';
import { MensajeriaFormComponent } from './components/mensajeria/mensajeria-form/mensajeria-form.component';
import { EstadodecuentaComponent } from './components/usuarios/estadodecuenta/estadodecuenta.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { SeguimientoActivosComponent } from './components/usuarios/seguimiento-activos/seguimiento-activos.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { UsuariosComponent } from './components/usuarios/usuarios/usuarios.component';
import { ReglasActivosComponent } from './components/parametros/reglas-activos/reglas-activos.component';
import { EquipamientoComponent } from './components/parametros/equipamiento/equipamiento.component';
import { EstadosDomiciliosComponent } from './components/parametros/estados-domicilios/estados-domicilios.component';
import { GananciasComponent } from './components/parametros/ganancias/ganancias.component';
import { TarifasComponent } from './components/parametros/tarifas/tarifas.component';
import { CiudadesComponent } from './components/parametros/ciudades/ciudades.component';
import { ConfigGlobalComponent } from './components/parametros/config-global/config-global.component';
import { ParametrosComponent } from './components/parametros/parametros/parametros.component';
import { TransaccionesComponent } from './components/solicitudes/transacciones/transacciones.component';
import { ReasignacionComponent } from './components/solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { SolicitudFormComponent } from './components/solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from './components/solicitudes/solicitud-list/solicitud-list.component';
import { SolicitudComponent } from './components/solicitudes/solicitud/solicitud.component';
import { RolGuard } from './guards/rol/rol.guard';


export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'pages',
        pathMatch: 'full'
    },
    {
        path: 'pages',
        component: AuthLayoutComponent,
        children: [{
            path: '', // login page still under "pages" folder as the original code
            loadChildren: './modules/pages/pages.module#PagesModule'
        }]
    },
    {
        path: 'persona',
        canActivate: [RolGuard],
        component: AdminLayoutComponent,
        children: [{
            path: '', // login page still under "pages" folder as the original code
            loadChildren: './modules/person/person.module#PersonModule'
        }]
    },
    {
        path: 'cliente',
        canActivate: [RolGuard],
        component: AdminLayoutComponent,
        children: [{
            path: '', // login page still under "pages" folder as the original code
            loadChildren: './modules/client/client.module#ClientModule'
        }]
    },
    {
        path: 'operador',
        canActivate: [RolGuard],
        component: AdminLayoutComponent,
        children: [{
            path: '', // login page still under "pages" folder as the original code
            loadChildren: './modules/operator/operator.module#OperatorModule'
        }]
    },
    {
        path: 'administrador',
        canActivate: [RolGuard],
        component: AdminLayoutComponent,
        children: [{
            path: '', // login page still under "pages" folder as the original code
            loadChildren: './modules/admin/admin.module#AdminModule'
        }]
    },
];