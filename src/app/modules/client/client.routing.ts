import { Routes } from '@angular/router';

import { DashboardComponent } from '../../components/dashboard/dashboard.component';
import { MensajeriaComponent } from '../../components/mensajeria/mensajeria/mensajeria.component';
import { MensajeriaFormComponent } from '../../components/mensajeria/mensajeria-form/mensajeria-form.component';
import { SolicitudComponent } from '../../components/solicitudes/solicitud/solicitud.component';
import { SolicitudListComponent } from '../../components/solicitudes/solicitud-list/solicitud-list.component';
import { SolicitudFormComponent } from '../../components/solicitudes/solicitud-form/solicitud-form.component';
import { ReasignacionComponent } from '../../components/solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { TransaccionesComponent } from '../../components/solicitudes/transacciones/transacciones.component';


export const ClientRoutes: Routes = [
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
    
];
