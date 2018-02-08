import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuardService } from './services/auth-guard.service';

export const AppRoutes: Routes = [
  {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
  {
      path: '',
      component: AdminLayoutComponent,
      canActivate: [AuthGuardService], //added canActivate and AuthGuard service
      children: [
          {
              path: '',
              loadChildren: './dashboard/dashboard.module#DashboardModule'
            }
      ]
    },
  {
      path: '',
      component: AuthLayoutComponent,
      children: [{
          path: 'pages', //login page still under "pages" folder as the original code
          loadChildren: './pages/pages.module#PagesModule'
        }]
    }
];