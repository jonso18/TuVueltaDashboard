import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth'
import 'rxjs/add/operator/toPromise';
import { AuthService } from './auth/auth.service';
import { ROLES } from '../config/Roles';
@Injectable()
export class AuthGuardService implements CanActivate {
  
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {   
    if (this.authService.userInfo){
      const hasPermission = this.authService.userInfo.Rol === ROLES.Administrador || this.authService.userInfo.Rol === ROLES.Cliente;
      console.log("Su Rol es: " + this.authService.userInfo.Rol)
      return hasPermission;
    }
    return false;
  }

}
