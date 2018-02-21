import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { IRol } from '../../interfaces/rol.interface';
import { DbService } from '../../services/db/db.service';
import { ROLES } from '../../config/Roles';
import { ICiudad } from '../../interfaces/ciudad.interface';
import { IParamsRegistro } from '../../interfaces/params-registro.interface';
import { MatSlideToggleChange, MatSelect } from '@angular/material';
import { ITipoServicio } from '../../interfaces/tipo-servicio.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../interfaces/usuario.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit, OnDestroy {

  form: FormGroup
  Roles$: Observable<IRol[]>;
  Ciudades$: Observable<ICiudad[]>;
  private subs: Subscription[] = [];
  public ROLES = ROLES;
  public Roles: IRol[];
  public ParamsMensajero$: Observable<IParamsRegistro>
  public TiposServicio$: Observable<ITipoServicio[]>
  public userInfo: IUser;
  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
    this.buildForm();
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log(`Id en nuevo ${id}`)
      if (id == 'nuevo') {
        return this.buildForm();

      }
      if (id) {
        this.subs.push(
          this.dbService.objectUserInfoSnap(id)
            .subscribe(res => {
              if (!res) {
                alert("El usuario no se encontró")
                return this.router.navigateByUrl(`/dashboard/Usuarios/lista`)
              }
              this.userInfo = res;
              this.loadFormToUpdate()
            }))
      }
    })

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
          logSolicitud: [null]
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

  toggleIsIntegratorClient(event: MatSlideToggleChange) {
    const isChecked: boolean = event.checked;
    if (isChecked) {
      this.form.addControl('ClienteIntegracion', this.formBuilder.group({
        urls: this.formBuilder.group({
          logSolicitud: [null]
        })
      }))
      return
    }

    this.form.removeControl('ClienteIntegracion')
  }

  AddTarifa(City: MatSelect, Service: MatSelect) {
    console.log(City, Service)
    const _city: string = City.value;
    const _service: string = Service.value;
    City.value = false;
    Service.value = false;
    console.log(typeof City)
    console.log(_city)
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



    console.log(cityGroup)
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
          minKm: [null ],
          value: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
        })
        tarifasGroup.addControl('Tarifa2', tarifa2)
        const tarifa3: FormGroup = this.formBuilder.group({
          minKm: [null ],
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
              console.log('updating value for max km')
              console.log(typeof val)
              tarifa1.get('maxKm').setValue(Number(val))
              tarifa2.get('minKm').setValue(Number(val) + 0.1)
              console.log(`Tarifa 2 minKm ${tarifa2.get('minKm').value}`)
              console.log(Number(tarifa2.get('minKm').value) > Number(tarifa2.get('maxKm').value))
              if (Number(tarifa2.get('minKm').value) > Number(tarifa2.get('maxKm').value)) {
                tarifa2.get('maxKm').setValue(Number(tarifa2.get('minKm').value) + 0.9)
                tarifa3.get('minKm').setValue(Number(tarifa2.get('minKm').value) + 1)
              }
            }))

        this.subs.push(
          tarifa2.get('maxKm').valueChanges
            .debounceTime(500)

            .subscribe(val => {
              console.log('updating value for max km')
              tarifa2.get('maxKm').setValue(Number(val))
              tarifa3.get('minKm').setValue(Number(val) + 0.1)
              console.log(Number(tarifa2.get('minKm').value) > Number(tarifa2.get('maxKm').value))
              if (Number(tarifa2.get('minKm').value) > Number(tarifa2.get('maxKm').value)) {
                tarifa2.get('maxKm').setValue(Number(tarifa2.get('minKm').value) + 0.9)
                tarifa3.get('minKm').setValue(Number(tarifa2.get('minKm').value) + 1)
              }
            }))

        break;
      case 'Mensajeria':
        tarifasGroup.addControl('Cancelacion', this.formBuilder.control(null, [Validators.required]))
        tarifasGroup.addControl('KmAdicional', this.formBuilder.control(null, [Validators.required]))
        tarifasGroup.addControl('ParadaAdicional', this.formBuilder.control(null, [Validators.required]))
        tarifasGroup.addControl('SobreCostoFueraCiudad', this.formBuilder.control(null, [Validators.required]))
        tarifasGroup.addControl('PrimerosKm', this.formBuilder.group({
          Costo: this.formBuilder.control(null, [Validators.required]),
          Km: this.formBuilder.control(null, [Validators.required])
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

      /* setTimeout(() => {
        const tarifas = this.form.get('Tarifas') as FormGroup;
        tarifas.addControl('11001', this.formBuilder.control(null))
      }, 5000); */
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
