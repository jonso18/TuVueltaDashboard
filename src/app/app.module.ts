import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



import { AppComponent } from './app.component';

import { AppRoutes } from './app.routing';


// services
import { AuthGuardService } from './services/auth-guard.service';


// components

import { SidebarModule } from './components/sidebar/sidebar.module';
import { FooterModule } from './components/shared/footer/footer.module';
import { NavbarModule } from './components/shared/navbar/navbar.module';
import { FixedpluginModule } from './components/shared/fixedplugin/fixedplugin.module';
import { AdminLayoutComponent } from './components/layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './components/layouts/auth/auth-layout.component';
import { AuthService } from './services/auth/auth.service';
import { DbService } from './services/db/db.service';
import { ReasignacionComponent, DialogReasignacion } from './components/solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { ReporteClientesServiciosComponent } from './components/reportes/reporte-clientes/reporte-clientes-servicios/reporte-clientes-servicios.component';
import { ReportesComponent } from './components/reportes/reportes/reportes.component';
import { HttpClientModule } from '@angular/common/http';


import { ToastrModule } from 'ngx-toastr';
import { ToastConfig } from './config/Toast';
import { GlobalTasksService } from './services/global-tasks/global-tasks.service';
import { MessagesService } from './services/messages/messages.service';
import { MaterialModule } from './modules/material/material.module';

import { MdModule } from './components/md/md.module';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { AgmCoreModule } from '@agm/core';


import { DashboardComponent } from './components/dashboard/dashboard.component';

import { SolicitudComponent } from './components/solicitudes/solicitud/solicitud.component';
import { SolicitudFormComponent, SolicitudFormDialog } from './components/solicitudes/solicitud-form/solicitud-form.component';
import { SolicitudListComponent } from './components/solicitudes/solicitud-list/solicitud-list.component';
import { ReglasActivosComponent } from './components/parametros/reglas-activos/reglas-activos.component';
import { EquipamientoComponent } from './components/parametros/equipamiento/equipamiento.component';
import { EstadosDomiciliosComponent } from './components/parametros/estados-domicilios/estados-domicilios.component';
import { GananciasComponent } from './components/parametros/ganancias/ganancias.component';
import { TarifasComponent } from './components/parametros/tarifas/tarifas.component';
import { CiudadesComponent, DialogNewCity, DialogDeleteCity } from './components/parametros/ciudades/ciudades.component';
import { ParametrosComponent } from './components/parametros/parametros/parametros.component';
import { MensajeriaFormComponent, DialogOnClickMap } from './components/mensajeria/mensajeria-form/mensajeria-form.component';
import { MensajeriaComponent } from './components/mensajeria/mensajeria/mensajeria.component';
import { ConfigGlobalComponent } from './components/parametros/config-global/config-global.component';
import { UsuarioFormComponent } from './components/usuarios/usuario-form/usuario-form.component';
import { UsuariosComponent } from './components/usuarios/usuarios/usuarios.component';
import { UsuariosListComponent } from './components/usuarios/usuarios-list/usuarios-list.component';
import { SeguimientoActivosComponent } from './components/usuarios/seguimiento-activos/seguimiento-activos.component';
import { RelanzamientosComponent } from './components/usuarios/relanzamientos/relanzamientos.component';
import { EstadodecuentaComponent } from './components/usuarios/estadodecuenta/estadodecuenta.component';
import { RetirosComponent } from './components/usuarios/retiros/retiros.component';
import { LogEquipamientoComponent } from './components/usuarios/log-equipamiento/log-equipamiento.component';
import { ConfirmationComponent } from './dialogs/confirmation/confirmation.component';
import { TransaccionesComponent } from './components/solicitudes/transacciones/transacciones.component';
import { ComprarServicioComponent } from './components/solicitudes/comprar-servicio/comprar-servicio.component';
import { DataTransaccionServicioComponent } from './components/solicitudes/data-transaccion-servicio/data-transaccion-servicio.component';
import { CambiarEstadoServicioComponent } from './components/solicitudes/cambiar-estado-servicio/cambiar-estado-servicio.component';
import { NoRetirementCreditDialogComponent } from './dialogs/no-retirement-credit-dialog/no-retirement-credit-dialog.component';
import { environment } from '../environments/environment';
import { PagesModule } from './modules/pages/pages.module';
import { CommonImportsModule } from './modules/common-imports/common-imports.module';

import { RolGuard } from './guards/rol/rol.guard';




@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  imports: [
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CommonImportsModule,
    RouterModule.forRoot(AppRoutes),
    MdModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule,
    AngularFireModule.initializeApp(environment.firebase),
    ToastrModule.forRoot(ToastConfig),
  ],
  providers: [
    AuthGuardService,
    AuthService,
    DbService,
    GlobalTasksService,
    MessagesService,
    RolGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
