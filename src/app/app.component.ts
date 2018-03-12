import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { DbService } from './services/db/db.service';
import { ROLES } from './config/Roles';
import { Router } from '@angular/router';
import { ESTADOS_USUARIO } from './config/EstadosUsuario';
import { GlobalTasksService } from './services/global-tasks/global-tasks.service';
import { administradorRoutes, clientRoutes, operatorRoutes, personRoutes } from './config/Routes';

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
  ) { }

  ngOnInit() {
    $.material.init();
    this.authService.routesForRol();
    this.loadUserData();
  }

  private loadUserData(): void {
    // Suscripcion al estado actual del login
    this.authService.authState().subscribe(_authState => {
      this.globalTasksService.stopTasks();
      const isLoggin = _authState ? true : false;
      this.authService.userState = _authState;
      if (!isLoggin) {
        // navigate to login
        this.router.navigateByUrl('/pages/login')
      } else {
        // Get user info
        this.authService.subUserInfo = this.dbService.objectUserInfo().snapshotChanges().subscribe(_userInfo => {
          
          this.globalTasksService.stopTasks();
          const info = this.authService.userInfo = _userInfo.payload.val();
          this.authService.userInfo.$key = _authState.uid;
          //console.log(info)
          if (info) {
            // Has user Info
            if (info.Estado === ESTADOS_USUARIO.Activo) {
              switch (info.Rol) {
                case ROLES.Administrador:
                  this.globalTasksService.startTasks();
                  this.authService.GlobalRoutes.next(administradorRoutes);
                  
                  this.router.navigateByUrl('/administrador/mensajeria/nuevo');
                  break;

                case ROLES.Cliente:
                  this.authService.GlobalRoutes.next(clientRoutes);
                  this.router.navigateByUrl('/cliente');
                  break;
                case ROLES.Mensajero:

                  break;
                case ROLES.Operador:
                  this.authService.GlobalRoutes.next(operatorRoutes);
                  this.router.navigateByUrl('/operador');
                  break;
                case ROLES.Persona:
                this.authService.GlobalRoutes.next(personRoutes);
                this.router.navigateByUrl('/persona');
                  break;
                default:
                  this.authService.logout().then(res => alert("Usuario no Autorizado"))
                  this.router.navigateByUrl('/pages/login')
                  break;
              }
            } else {
              this.authService.logout().then(res => alert("Usuario Bloqueado, comunicarse con administracin"))
              return this.router.navigateByUrl('/pages/login')
            }

          }else {
            return alert("El usuario no tiene informacion")
          }
          
        })
      }
    })
  }

}
