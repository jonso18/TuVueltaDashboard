import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonImportsModule } from '../common-imports/common-imports.module';
import { RouterModule } from '@angular/router';
import { SharedComponentsModule } from '../shared-components/shared-components.module';
import { DialogNewCity, DialogDeleteCity, CiudadesComponent } from '../../components/parametros/ciudades/ciudades.component';
import { DialogReasignacion } from '../../components/solicitudes/reasignaciones/reasignacion/reasignacion.component';
import { SolicitudFormDialog } from '../../components/solicitudes/solicitud-form/solicitud-form.component';
import { NoRetirementCreditDialogComponent } from '../../dialogs/no-retirement-credit-dialog/no-retirement-credit-dialog.component';
import { ParametrosComponent } from '../../components/parametros/parametros/parametros.component';
import { TarifasComponent } from '../../components/parametros/tarifas/tarifas.component';
import { GananciasComponent } from '../../components/parametros/ganancias/ganancias.component';
import { EstadosDomiciliosComponent } from '../../components/parametros/estados-domicilios/estados-domicilios.component';
import { EquipamientoComponent } from '../../components/parametros/equipamiento/equipamiento.component';
import { ReglasActivosComponent } from '../../components/parametros/reglas-activos/reglas-activos.component';
import { UsuarioFormComponent } from '../../components/usuarios/usuario-form/usuario-form.component';
import { UsuariosComponent } from '../../components/usuarios/usuarios/usuarios.component';
import { UsuariosListComponent } from '../../components/usuarios/usuarios-list/usuarios-list.component';
import { ConfigGlobalComponent } from '../../components/parametros/config-global/config-global.component';
import { RelanzamientosComponent } from '../../components/usuarios/relanzamientos/relanzamientos.component';
import { EstadodecuentaComponent } from '../../components/usuarios/estadodecuenta/estadodecuenta.component';
import { RetirosComponent } from '../../components/usuarios/retiros/retiros.component';
import { LogEquipamientoComponent } from '../../components/usuarios/log-equipamiento/log-equipamiento.component';
import { OperatorRoutes } from './operator.routing';
import { SeguimientoActivosComponent } from '../../components/usuarios/seguimiento-activos/seguimiento-activos.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    RouterModule.forChild(OperatorRoutes),
    CommonImportsModule,
    AgmCoreModule,
    CommonModule,
    SharedComponentsModule
]
})
export class OperatorModule { }
