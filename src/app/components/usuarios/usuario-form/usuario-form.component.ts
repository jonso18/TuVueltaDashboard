import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { IRol } from '../../../interfaces/rol.interface';
import { DbService } from '../../../services/db/db.service';
import { ROLES } from '../../../config/Roles';
import { ICiudad } from '../../../interfaces/ciudad.interface';
import { IParamsRegistro } from '../../../interfaces/params-registro.interface';
import { MatSlideToggleChange, MatSelect, MatSnackBar } from '@angular/material';
import { ITipoServicio } from '../../../interfaces/tipo-servicio.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../../interfaces/usuario.interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { IEstadoUsuario } from '../../../interfaces/estadousuario.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit, OnDestroy {

  EstadosUsuario$: Observable<IEstadoUsuario[]>;
  form: FormGroup
  Roles$: Observable<IRol[]>;
  Ciudades$: Observable<ICiudad[]>;
  private subs: Subscription[] = [];
  public ROLES = ROLES;
  public Roles: IRol[];
  public ParamsMensajero$: Observable<IParamsRegistro>
  public TiposServicio$: Observable<ITipoServicio[]>
  public userInfo: IUser;
  public isUpdating: boolean = false;
  public userId: string;
  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit() {
    this.loadData();

    this.route.params.subscribe(params => {
      const id = params['id'];

      if (id == 'nuevo') {
        

        this.buildForm();
        this.addControlToSignup();
        return

      } else if (id) {
        this.userId = id;
        this.subs.push(
          this.dbService.objectUserInfoSnap(id)
            .subscribe(res => {
              this.userInfo = res;
              this.isUpdating = true;
              this.loadFormToUpdate()
            }))
      }
    })

  }

  addControlToSignup() {
    this.form.addControl('Password1', this.formBuilder.control(null, [
      Validators.required,
      Validators.minLength(6)
    ]))
    this.form.addControl('Password2', this.formBuilder.control(null, [
      Validators.required
    ]))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }


  loadFormToUpdate() {
    this.buildForm();
    const rol = this.userInfo.Rol;
    this.AddInputsByRol(rol)
    const Tarifas = this.userInfo.Tarifas;

    if (Tarifas) {
      this.form.addControl('Tarifas', this.formBuilder.group({}))
      this.hasTarifasPersonalizadas.setValue(true)

      Object.keys(Tarifas).forEach(cityCode => {
        Object.keys(Tarifas[cityCode]).forEach(serviceCode => {
          this.addCustomTarifa(cityCode, serviceCode);
        })
      });

    }

    const ClienteIntegracion = this.userInfo.ClienteIntegracion;
    if (ClienteIntegracion) {
      this.form.addControl('ClienteIntegracion', this.formBuilder.group({
        urls: this.formBuilder.group({
          logSolicitud: [null, [Validators.required]]
        })
      }));
      this.EsClienteDeIntegracion.setValue(true);
    }
    this.form.patchValue(this.userInfo);
  }

  loadData() {
    this.Roles$ = this.dbService.listRol();
    this.Ciudades$ = this.dbService.listCiudades();
    this.ParamsMensajero$ = this.dbService.listParamsRegistro();
    this.TiposServicio$ = this.dbService.listTiposServicio();
    this.EstadosUsuario$ = this.dbService.listEstadosUsuarioSnap();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      Nombres: [null, [Validators.required]],
      Apellidos: [null, [Validators.required]],
      Cedula: [null, [Validators.required]],
      Celular: [null, [Validators.required]],
      Ciudad: [null, [Validators.required]],
      Estado: [null, [Validators.required]],
      Correo: [null, [Validators.required, Validators.email]],
      Rol: [null, [Validators.required]]
    })

    if (!this.isUpdating) {
      this.addControlToSignup();
    }
  }

  toggleIsIntegratorClient(event: MatSlideToggleChange) {
    const isChecked: boolean = event.checked;
    if (isChecked) {
      this.form.addControl('ClienteIntegracion', this.formBuilder.group({
        urls: this.formBuilder.group({
          logSolicitud: [null, [Validators.required]]
        })
      }))
      return
    }

    this.form.removeControl('ClienteIntegracion')
  }

  AddTarifa(City: MatSelect, Service: MatSelect) {
    const _city: string = City.value;
    const _service: string = Service.value;
    City.value = false;
    Service.value = false;
    this.addCustomTarifa(_city, _service);

  }


  addCustomTarifa(_city: string, _service: string) {
    if (!this.Tarifas.get(_city)) {
      this.Tarifas.addControl(_city, this.formBuilder.group({}))
    }

    const cityGroup: FormGroup = this.Tarifas.get(_city) as FormGroup;
    cityGroup.addControl(_service, this.formBuilder.group({}))

    const serviceGroup: FormGroup = cityGroup.get(_service) as FormGroup;
    serviceGroup.addControl('Tarifas', this.formBuilder.group({}))
    const tarifasGroup: FormGroup = serviceGroup.get('Tarifas') as FormGroup;




    switch (_service) {
      case 'Domicilios':
        const tarifa1: FormGroup = this.formBuilder.group({
          maxKm: [null, [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
          minKm: [0],
          value: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
        })
        tarifasGroup.addControl('Tarifa1', tarifa1)

        const tarifa2: FormGroup = this.formBuilder.group({
          maxKm: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
          minKm: [null],
          value: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
        })
        tarifasGroup.addControl('Tarifa2', tarifa2)
        const tarifa3: FormGroup = this.formBuilder.group({
          minKm: [null],
          value: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
        })

        this.subs.push(tarifa1.get('value')
          .valueChanges
          .debounceTime(500)
          .subscribe(val => {
            tarifa1.get('value').setValue(Number(val))
          }))

        this.subs.push(tarifa2.get('value')
          .valueChanges
          .debounceTime(500)
          .subscribe(val => {
            tarifa2.get('value').setValue(Number(val))
          }))

        this.subs.push(tarifa3.get('value')
          .valueChanges
          .debounceTime(500)
          .subscribe(val => {
            tarifa3.get('value').setValue(Number(val))
          }))
        tarifasGroup.addControl('Tarifa3', tarifa3)
        this.subs.push(
          tarifa1.get('maxKm').valueChanges
            .debounceTime(500)
            .subscribe(val => {
              tarifa1.get('maxKm').setValue(Number(val))
              tarifa2.get('minKm').setValue(Number(val) + 0.1)
              if (Number(tarifa2.get('minKm').value) > Number(tarifa2.get('maxKm').value)) {
                tarifa2.get('maxKm').setValue(Number(tarifa2.get('minKm').value) + 0.9)
                tarifa3.get('minKm').setValue(Number(tarifa2.get('minKm').value) + 1)
              }
            }))

        this.subs.push(
          tarifa2.get('maxKm').valueChanges
            .debounceTime(500)

            .subscribe(val => {
              tarifa2.get('maxKm').setValue(Number(val))
              tarifa3.get('minKm').setValue(Number(val) + 0.1)
              if (Number(tarifa2.get('minKm').value) > Number(tarifa2.get('maxKm').value)) {
                tarifa2.get('maxKm').setValue(Number(tarifa2.get('minKm').value) + 0.9)
                tarifa3.get('minKm').setValue(Number(tarifa2.get('minKm').value) + 1)
              }
            }))

        break;
      case 'Mensajeria':
        tarifasGroup.addControl('Cancelacion', this.formBuilder.control(null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]))
        tarifasGroup.addControl('KmAdicional', this.formBuilder.control(null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]))
        tarifasGroup.addControl('ParadaAdicional', this.formBuilder.control(null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]))
        tarifasGroup.addControl('SobreCostoFueraCiudad', this.formBuilder.control(null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]))
        tarifasGroup.addControl('PrimerosKm', this.formBuilder.group({
          Costo: this.formBuilder.control(null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]),
          Km: this.formBuilder.control(null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')])
        }))
      default:
        break;
    }
  }

  deleteControl(Ciudad, tipo) {
    const cityGroup: FormGroup = this.Tarifas.get(Ciudad) as FormGroup;

    cityGroup.removeControl(tipo);
    console.log(cityGroup.value)
    if (Object.keys(cityGroup.value).length === 0) {
      this.Tarifas.removeControl(Ciudad)
    }
  }



  toggleTarifasPersonalizadas(event: MatSlideToggleChange, Ciudades: ICiudad[]) {
    const isChecked: boolean = event.checked;
    if (isChecked) {
      this.form.addControl('Tarifas', this.formBuilder.group({}))
      return
    }
    this.form.removeControl('Tarifas')
  }

  AddInputsByRol(key) {
    const formData = this.form.value;

    this.buildForm();
    this.form.patchValue(formData);
    switch (key) {
      case ROLES.Administrador:

        break;
      case ROLES.Cliente:
        this.addControlsCliente();
        break;

      case ROLES.Mensajero:

        this.addControlsMensajero();

        break;
      case ROLES.Operador:

        break;
      default:
        break;
    }
  }

  onSubmitCreate() {
    const isFormValid: boolean = this.form.valid;
    if (isFormValid) {
      const getToken: Promise<any> = this.authService.userState.getIdToken()
      getToken.then(token => {
        return this.createUser(token).then(res => {
          const uid: string = res.uid;
          let body = this.form.value;
          delete body.Password1
          delete body.Password2
          return this.updateUser(uid, body, token)
        })
      }).then(res => {
        console.log('user created', res)
        return this.location.back()
      }).then(res =>{
        this.snackBar.open("Usuario Creado Exitosamente", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
        
      }).catch(err=>{
        this.snackBar.open("Error al crear usuario", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      });
    }
  }

  goback(){
    this.location.back();
  }

  updateUser(uid: string, body: IUser, token: string) {
    const url: string = `${environment.firebase.databaseURL}/Administrativo/Usuarios/${uid}.json?auth=${token}`
    return this.http.put(url, body).toPromise();
  }

  createUser(token: string): Promise<any> {
    const email: string = this.Correo.value;
    const password: string = this.Password1.value;
    const body = {
      email: email,
      password: password,
      idToken: token
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    const url: string = `${environment.baseapi.tuvuelta}/api/usuarios/nuevo`
    return this.http.post(url, body, httpOptions).toPromise();
  }

  onSubmitUpdate() {
    const isFormValid: boolean = this.form.valid;
    if (isFormValid) {
      const getToken: Promise<any> = this.authService.userState.getIdToken()
      getToken.then(token => {
        const body: IUser = this.form.value;
        const id: string = this.userId;
        return this.updateUser(id, body, token)
      }).then(res => {
        this.snackBar.open("Usuario Actualizado Exitosamente", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
        return this.goback()
      }).catch(err => {
        this.snackBar.open("Error al Actualizar", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      })
    }
  }

  addControlsCliente() {
    this.form.addControl('EsClienteDeIntegracion', this.formBuilder.control(null))
    this.form.addControl('hasTarifasPersonalizadas', this.formBuilder.control(false))
  }

  addControlsMensajero() {
    this.form.addControl('PlacaVehiculo', this.formBuilder.control(null, Validators.required))
    this.form.addControl('FechaNacimiento', this.formBuilder.control(null, Validators.required))
    this.form.addControl('TiempoDispParaHacerServicio', this.formBuilder.control(null, Validators.required))
    this.form.addControl('ComoNosConocio', this.formBuilder.control(null, Validators.required))
    this.form.addControl('TieneEPS', this.formBuilder.control(null, Validators.required))
    this.form.addControl('TipoVehiculo', this.formBuilder.control(null, Validators.required))
    this.form.addControl('TipoCelular', this.formBuilder.control(null, Validators.required))
  }

  get Nombres() { return this.form.get('Nombres') }
  get Apellidos() { return this.form.get('Apellidos') }
  get Cedula() { return this.form.get('Cedula') }
  get Celular() { return this.form.get('Celular') }
  get Ciudad() { return this.form.get('Ciudad') }
  get Correo() { return this.form.get('Correo') }
  get Rol() { return this.form.get('Rol') }
  get Estado() { return this.form.get('Estado') }
  get Password1() { return this.form.get('Password1') }
  get Password2() { return this.form.get('Password2') }

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
  get hasTarifasPersonalizadas() { return this.form.get('hasTarifasPersonalizadas') }
  get Tarifas() { return this.form.get('Tarifas') as FormGroup }


}
