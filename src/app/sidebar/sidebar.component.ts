import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth/auth.service';
import { ROLES } from '../config/Roles';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    Rol?:any;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
    Rol?:any;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/dashboard/inicio',
        title: 'Dashboard',
        type: 'link',
        icontype: 'dashboard',
        Rol: {
            Administrador: ROLES.Administrador,
            Cliente: ROLES.Cliente
        }
    },{
        path: '/dashboard/solicitud',
        title: 'Cargar Domicilio',
        type: 'link',
        icontype: 'motorcycle',
        Rol: {
            Cliente: ROLES.Cliente
        }
    },
    {
        path: '/parametros',
        title: 'Parametros',
        Rol: {
            Administrador: ROLES.Administrador,
            Cliente: ROLES.Cliente
        },
        type: 'sub',
        icontype: 'settings',
        collapse: 'parametros',
        children: [
            {path: 'ciudad', title: 'Ciudades', ab:'CI', Rol: {Cliente: ROLES.Cliente}},
            {path: 'tarifas', title: 'Tarifas', ab:'T', Rol: {Cliente: ROLES.Cliente}},
            {path: 'Ganacias', title: 'Ganacias', ab:'G', Rol: {Cliente: ROLES.Cliente}},
            {path: 'Estados-Domicilios', title: 'Estados Domicilios', ab:'ED', Rol: {Cliente: ROLES.Cliente}},
            {path: 'Equipamiento', title: 'Equipamiento', ab:'EQ', Rol: {Cliente: ROLES.Cliente}},
            {path: 'Reglas-activo', title: 'Reglas de Activo', ab:'RA', Rol: {Administrador: ROLES.Administrador}},
        ]
       },
];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    constructor(public authService:AuthService){}


    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    updatePS(): void  {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }
    
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }
}
