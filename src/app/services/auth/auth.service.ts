import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { RouteInfo } from '../../components/sidebar/sidebar.component';
import { clientRoutes, operatorRoutes, administradorRoutes } from '../../config/Routes';
import { User } from '@firebase/auth-types';
import { IUser } from '../../interfaces/usuario.interface';

@Injectable()
export class AuthService {

  public userInfo: IUser;
  public userState: User;
  public GlobalRoutes: BehaviorSubject<RouteInfo[]> = new BehaviorSubject([]);
  public subUserInfo: Subscription;
  constructor(
    private authService: AngularFireAuth,
    private router: Router
  ) { }

  routesForRol(){
    /* this.router.events.subscribe(res => {
      
      if (res instanceof NavigationEnd){
        const data: NavigationEnd = res;

        if (res.urlAfterRedirects.indexOf('dashboard') != -1){
          this.GlobalRoutes.next(administradorRoutes)
        }

        if (res.urlAfterRedirects.indexOf('cliente') != -1){
          this.GlobalRoutes.next(clientRoutes)
        }

        if (res.urlAfterRedirects.indexOf('operador') != -1){
          this.GlobalRoutes.next(operatorRoutes)
        }

        if (res.urlAfterRedirects.indexOf('administrador') != -1){
          this.GlobalRoutes.next(administradorRoutes)
        }
      }
      
    }) */
  }

  public authState() {
    return this.authService.authState;
  }

  public logout() {
    this.subUserInfo.unsubscribe();
    return this.authService.auth.signOut()
  }

  /**
   * test
   */
  public test() {
    return this.authService.idToken
  }

  public createUser(email:string, password:string): Promise<any>{
    return this.authService.app.auth().createUserAndRetrieveDataWithEmailAndPassword(email,password)
    /* return this.authService.auth.app.auth().createUserWithEmailAndPassword(email,password) */
    /* return this.authService.auth.createUserAndRetrieveDataWithEmailAndPassword(email,password) */
    /* return this.authService.auth.createUserWithEmailAndPassword(email,password) */
  }
}
