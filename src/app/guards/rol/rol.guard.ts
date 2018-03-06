import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../services/auth/auth.service';
import { ROLES } from '../../config/Roles'

@Injectable()
export class RolGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.userState &&
      this.authService.userState.uid &&
      this.authService.userInfo &&
      this.authService.userInfo.Rol.toLowerCase() == state.url.split('/')[1].toLowerCase()) {
      return true
    }
    console.log('blocked by guard')
    return false
  }
}
