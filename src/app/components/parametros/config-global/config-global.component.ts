import { Component, OnInit, OnDestroy } from '@angular/core';
import { DbService } from '../../../services/db/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IGlobalConfig } from '../../../interfaces/config-global.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../../../interfaces/usuario.interface';
import { ROLES } from '../../../config/Roles';
import { MatSelect, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-config-global',
  templateUrl: './config-global.component.html',
  styleUrls: ['./config-global.component.css']
})
export class ConfigGlobalComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public Clientes$: Observable<IUser[]>;
  public subs: Subscription[] = [];
  constructor(
    private dbService: DbService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.Clientes$ = this.dbService.listUsersByRol(ROLES.Cliente);
    this.loadInfo();
    console.log(this.subs.length)
  }

  ngOnDestroy(){
    this.subs.forEach(sub => sub.unsubscribe());
  }

  loadInfo() {
    this.subs.push(this.dbService.objectConfigGlobal()
      .subscribe((res: IGlobalConfig) => {
        this.buildForm();
        this.validateIfUsuarios(res);
        this.form.patchValue(res);
      }))
  }

  validateIfUsuarios(globalConfig: IGlobalConfig): void {
    if (globalConfig.Usuarios) {
      const usuarios: any = globalConfig.Usuarios;
      const userKeys: string[] = Object.keys(usuarios);
      if (userKeys.length > 0) {
        userKeys.forEach(key => {
          this.addCustomUserConfig(key);
        })
      }
    }
  }

  onClickaddCustomUserConfig(selectCliente: MatSelect) {
    const userId: string = selectCliente.value;
    this.addCustomUserConfig(userId)
    selectCliente.value = null;
  }

  addCustomUserConfig(userId: string): void {
    if (!this.Usuarios) {
      this.form.addControl('Usuarios', this.formBuilder.group({}));
    }
    const usuariosGroup: FormGroup = this.form.get('Usuarios') as FormGroup;
    usuariosGroup.addControl(userId, this.formBuilder.group({
      CantSrvcQuePuedeComprarMensajero: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
    }))
  }

  removeCustomUserConfig(userId: string): void {
    const usuariosGroup: FormGroup = this.form.get('Usuarios') as FormGroup;
    usuariosGroup.removeControl(userId);

    const Usuarios = this.form.get('Usuarios').value;
    if (Object.keys(Usuarios).length == 0) {
      this.form.removeControl('Usuarios')
    }
  }

  deleteCustomUserConfig() {
    this.form.removeControl
  }

  buildForm() {
    this.form = this.formBuilder.group({
      CantSrvcQuePuedeComprarMensajero: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      DistanciaActivarBotonEstadoSrvc: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      TiempoCambiarAInactivo: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      TiempoIntervaloRevisarUltimoCambioEstado: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
    })
  }

  onSubmit() {
    const isValid: boolean = this.form.valid;
    if (isValid) {
      this.update();
    }
  }

  update() {
    const data: IGlobalConfig = this.form.value;
    this.http.put(`${environment.firebase.databaseURL}/Administrativo/ConfigGlobal.json`, data)
      .toPromise()
      .then(res => {
        this.snackBar.open("Configuración Global Actualizada Exitosamente", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      })
  }

  get CantSrvcQuePuedeComprarMensajero() { return this.form.get('CantSrvcQuePuedeComprarMensajero') }
  get DistanciaActivarBotonEstadoSrvc() { return this.form.get('DistanciaActivarBotonEstadoSrvc') }
  get TiempoCambiarAInactivo() { return this.form.get('TiempoCambiarAInactivo') }
  get TiempoIntervaloRevisarUltimoCambioEstado() { return this.form.get('TiempoIntervaloRevisarUltimoCambioEstado') }
  get Usuarios() { return this.form.get('Usuarios') }
}
