import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { DbService } from './services/db/db.service';
import { ROLES } from './config/Roles';
import { Router } from '@angular/router';
import { ESTADOS_USUARIO } from './config/EstadosUsuario';
import { GlobalTasksService } from './services/global-tasks/global-tasks.service';
import { administradorRoutes, clientRoutes, operatorRoutes } from './config/Routes';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  private subUserInfo: Subscription;
  constructor(
    private authService: AuthService,
    private dbService: DbService,
    private router: Router,
    private globalTasksService: GlobalTasksService
  ) {  }

  ngOnInit(){
    $.material.init();
    this.authService.routesForRol();
    this.loadUserData();
  }
 
  private loadUserData():void {
    // Suscripcion al estado actual del login
    this.authService.authState().subscribe(_authState => {
      this.globalTasksService.stopTasks();
      const isLoggin = _authState ? true : false;
      this.authService.userState = _authState;
      if (!isLoggin) {
        // navigate to login
        this.router.navigateByUrl('/pages/login')
      }else {
        // Get user info
        this.authService.subUserInfo = this.dbService.objectUserInfo().snapshotChanges().subscribe(_userInfo => {
          this.globalTasksService.stopTasks();
          const info = this.authService.userInfo = _userInfo.payload.val();
          //console.log(info)
          if (info){
            // Has user Info
            if (info.Estado === ESTADOS_USUARIO.Activo){
              if (info.Rol === ROLES.Administrador){
                // Navigate to Administrator root url
                this.globalTasksService.startTasks();
                this.authService.GlobalRoutes.next(administradorRoutes);
                return this.router.navigateByUrl('/administrador');
              }else if (info.Rol === ROLES.Cliente){
                // Navigate to Cliente root url
                this.authService.GlobalRoutes.next(clientRoutes);
                return this.router.navigateByUrl('/cliente');
              }else if (info.Rol === ROLES.Operador){
                // Navigate to Cliente root url
                this.authService.GlobalRoutes.next(operatorRoutes);
                return this.router.navigateByUrl('/operador');
              } 
              
              else {
                // Navigate to No Authorized User
                this.authService.logout().then(res => alert("Usuario no Autorizado"))
                return this.router.navigateByUrl('/pages/login')
              }
            }else {
              this.authService.logout().then(res => alert("Usuario Bloqueado, comunicarse con administracin"))
                return this.router.navigateByUrl('/pages/login')
            }
            
          }
          return alert("El usuario no tiene informacion")
        })
      }
    })
  }

}
