import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { IRol } from '../../interfaces/rol.interface';
import { DbService } from '../../services/db/db.service';
import { ROLES } from '../../config/Roles';
import { ICiudad } from '../../interfaces/ciudad.interface';
import { IParamsRegistro } from '../../interfaces/params-registro.interface';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  form: FormGroup
  Roles$: Observable<IRol[]>;
  Ciudades$: Observable<ICiudad[]>;
  public ROLES = ROLES;
  public Roles: IRol[];
  public ParamsMensajero$: Observable<IParamsRegistro>
  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.loadData();
    this.buildForm();
  }

  loadData() {
    this.Roles$ = this.dbService.listRol();
    this.Ciudades$ = this.dbService.listCiudades();
    this.ParamsMensajero$ = this.dbService.listParamsRegistro();

  }

  buildForm() {
    this.form = this.formBuilder.group({
      Nombres: [null, [Validators.required]],
      Apellidos: [null, [Validators.required]],
      Cedula: [null, [Validators.required]],
      Celular: [null, [Validators.required]],
      Ciudad: [null, [Validators.required]],
      Correo: [null, [Validators.required]],
      Rol: [null, [Validators.required]]
    })
  }

  toggleIsIntegratorClient(event: MatSlideToggleChange){
    const isChecked: boolean = event.checked;
    if (isChecked){
      this.form.addControl('ClienteIntegracion', this.formBuilder.group({
        urls: this.formBuilder.group({
          logSolicitud: [null]
        })
      }))
      return
    }

    this.form.removeControl('ClienteIntegracion')
  }

  AddInputsByRol(key) {
    const formData = this.form.value;
    this.buildForm();
    this.form.patchValue(formData);
    switch (key) {
      case ROLES.Administrador:

        break;
      case ROLES.Cliente:
        this.form.addControl('EsClienteDeIntegracion', this.formBuilder.control(null))
        
        break;

      case ROLES.Mensajero:

        this.form.addControl('PlacaVehiculo', this.formBuilder.control(null, Validators.required))
        this.form.addControl('FechaNacimiento', this.formBuilder.control(null, Validators.required))
        this.form.addControl('TiempoDispParaHacerServicio', this.formBuilder.control(null, Validators.required))
        this.form.addControl('ComoNosConocio', this.formBuilder.control(null, Validators.required))
        this.form.addControl('TieneEPS', this.formBuilder.control(null, Validators.required))
        this.form.addControl('TipoVehiculo', this.formBuilder.control(null, Validators.required))
        this.form.addControl('TipoCelular', this.formBuilder.control(null, Validators.required))

        break;
      case ROLES.Operador:

        break;
      default:
        break;
    }
  }

  get Nombres() { return this.form.get('Nombres') }
  get Apellidos() { return this.form.get('Apellidos') }
  get Cedula() { return this.form.get('Cedula') }
  get Celular() { return this.form.get('Celular') }
  get Ciudad() { return this.form.get('Ciudad') }
  get Correo() { return this.form.get('Correo') }
  get Rol() { return this.form.get('Rol') }

  /* Mensajero */

  get PlacaVehiculo() { return this.form.get('PlacaVehiculo') }
  get FechaNacimiento() { return this.form.get('FechaNacimiento') }
  get TiempoDispParaHacerServicio() { return this.form.get('TiempoDispParaHacerServicio') }
  get ComoNosConocio() { return this.form.get('ComoNosConocio') }
  get TieneEPS() { return this.form.get('TieneEPS') }
  get TipoVehiculo() { return this.form.get('TipoVehiculo') }
  get TipoCelular() { return this.form.get('TipoCelular') }

  /* Cliente */
  get EsClienteDeIntegracion() { return this.form.get('EsClienteDeIntegracion') }
  get ClienteIntegracion() { return this.form.get('ClienteIntegracion') }
  get urlsIntegracion() { return this.ClienteIntegracion.get('urls') }
  get logSolicitud() { return this.urlsIntegracion.get('logSolicitud') }
}
