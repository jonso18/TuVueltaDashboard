import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { SolicitudComponent } from '../solicitudes/solicitud/solicitud.component';
import { SolicitudFormComponent } from '../solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from '../solicitudes/solicitud-list/solicitud-list.component';

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
                            }
                        ]
                    }
                    
                ]
            }
            
        ]
    }
];
