import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../services/auth/auth.service';
import { ROLES } from '../../config/Roles';
import { Router } from '@angular/router';


declare const $: any;

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    Rol?: any;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
    Rol?: any;
}

// Menu Items
export const ROUTES: RouteInfo[] = [];
@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];

    constructor(
        public authService: AuthService,
        private router: Router
    ) { }


    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }

    isMainNode(node: string, child: string): boolean{
        const url: string = this.router.url;
        return ((url.split('/').length - 1) == 2 && url == node && child == 'lista')
      }
    

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.authService.GlobalRoutes.subscribe(res => {
            this.menuItems = res;
        })
    }

    updatePS(): void {
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
