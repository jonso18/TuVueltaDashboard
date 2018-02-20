import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { DbService } from './services/db/db.service';
import { ROLES } from './config/Roles';
import { Router } from '@angular/router';
import { ESTADOS_USUARIO } from './config/EstadosUsuario';

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
    private router: Router
  ) {  }

  ngOnInit(){
    $.material.init();
    this.loadUserData();
  }

  private loadUserData():void {
    // Suscripcion al estado actual del login
    this.authService.authState().subscribe(_authState => {
      const isLoggin = _authState ? true : false;
      this.authService.userState = _authState;
      if (!isLoggin) {
        // navigate to login
        this.router.navigateByUrl('/pages/login')
      }else {
        // Get user info
        this.subUserInfo = this.dbService.objectUserInfo().snapshotChanges().subscribe(_userInfo => {
          const info = this.authService.userInfo = _userInfo.payload.val();
          //console.log(info)
          if (info){
            // Has user Info
            if (info.Estado === ESTADOS_USUARIO.Activo){
              if (info.Rol === ROLES.Administrador){
                // Navigate to Administrator root url

                return this.router.navigateByUrl('/dashboard/Usuarios/nuevo')
              }else if (info.Rol === ROLES.Cliente){
                // Navigate to Cliente root url
                return this.router.navigateByUrl('/dashboard')
              }else {
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
