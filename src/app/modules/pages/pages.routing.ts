import { Routes } from '@angular/router';

import { RegisterComponent } from '../../components/pages/register/register.component';
import { PricingComponent } from '../../components/pages/pricing/pricing.component';
import { LockComponent } from '../../components/pages/lock/lock.component';
import { LoginComponent } from '../../components/pages/login/login.component';

export const PagesRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    }, {
        path: 'lock',
        component: LockComponent
    }, {
        path: 'register',
        component: RegisterComponent
    }, {
        path: 'pricing',
        component: PricingComponent
    }
];
