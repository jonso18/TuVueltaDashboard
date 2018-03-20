import { Component, OnInit, OnDestroy, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Subscription } from 'rxjs/Subscription';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatHorizontalStepper, MatSelect, MatSelectChange } from '@angular/material';
import { LatLngLiteral, LatLng } from '@agm/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DbService } from '../../../services/db/db.service';
import { ITarifasMensajeria } from '../../../interfaces/tarifas.interfaces';
import { AuthService } from '../../../services/auth/auth.service';
import { ICiudad } from '../../../interfaces/ciudad.interface';
import { Toast, ToastrService, IndividualConfig, ActiveToast, } from 'ngx-toastr';
import { ROLES } from '../../../config/Roles';
import { IUser } from '../../../interfaces/usuario.interface';
import { IGanancias } from '../../../interfaces/gananciass.interface';
import { ESTADOS_SERVICIO } from '../../../config/EstadosServicio';

declare const $: any;
@Component({
  selector: 'app-mensajeria-form',
  templateUrl: './mensajeria-form.component.html',
  styleUrls: ['./mensajeria-form.component.css']
})
export class MensajeriaFormComponent implements OnInit, OnDestroy, AfterViewInit {
  ngAfterViewInit(): void {
    $('body').addClass('sidebar-mini');
    $('.sidebar .collapse').css('height', 'auto');
  }
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  @ViewChild('clientSelect') clientSelect: MatSelect;

  lat: number = 4.433;
  lng: number = -75.217;
  public form: FormGroup;
  private subs: Subscription[] = [];
  public isSaving$: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public isMapReady: boolean = false;
  public points = [];
  public isStepEditable: boolean = true;
  public isQuoteCompleted: boolean = false;
  public TarifasMensajeria: ITarifasMensajeria;
  public TarifasMensajeriaCustom: ITarifasMensajeria;
  public Ciudades: ICiudad[];
  public selectedCity: ICiudad;
  public subTM: Subscription;
  public subTMC: Subscription;
  public subClnts: Subscription;
  public Servicio: IServicioMensajeria;
  public isQuoting: boolean = false;
  public Clientes: IUser[];
  public selectedCliente: IUser;
  public Details: any;
  public Directions: LatLng[] = [];
  public isValidDetails: boolean = false;
  public messageSaved: string;
  public TravelSummary: IPunto[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private dbService: DbService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnDestroy(): void {
    $('body').removeClass('sidebar-mini');
    if (this.subTM) this.subTM.unsubscribe();
    if (this.subTMC) this.subTMC.unsubscribe();
    if (this.subClnts) this.subClnts.unsubscribe();
    this.subs.forEach(sub => sub.unsubscribe());
  }




  ngOnInit(): void {
    if (this.authService.userInfo.Rol == ROLES.Administrador || this.authService.userInfo.Rol == ROLES.Operador) {
      this.loadClientes();
    } else {
      this.selectedCliente = this.authService.userInfo;
    }

    this.loadCitys();
    this.buildForm();

  }

  loadClientes() {
    if (this.subClnts) this.subClnts.unsubscribe();
    this.subClnts = this.dbService.listUsersByRol(ROLES.Cliente)
      .subscribe(res => {
        this.Clientes = res;
        if (!this.selectedCliente) {
          setTimeout(() => {
            this.selectedCliente = res[0]
            if (this.Ciudades) {
              this.selectedCity = this.Ciudades[0]
              this.loadTarifasMensajeria(this.selectedCity.Codigo);
              this.loadTarifasMensajeriaCustom(this.selectedCity.Codigo);
            }
          }, 1000);
        }
      })
  }

  public onSelectedClient(event: MatSelectChange): void {

    this.selectedCliente = event.value;
    this.selectedCity = null;

  }

  public onSelectedCity(event: MatSelectChange): void {

    const code: number = Number(this.selectedCity.Codigo);
    this.loadTarifasMensajeria(code);
    this.loadTarifasMensajeriaCustom(code);
  }

  private loadCitys(): void {
    this.subs.push(this.dbService.listCiudades().subscribe(res => {
      this.Ciudades = res;
    }))
  }

  public onMapClick(event: any): void {
    if (this.stepper.selectedIndex != 0) return
    const coors: LatLngLiteral = event.coords;
    const dialog = this.dialog.open(DialogOnClickMap, {
      width: '250px',
      data: {}
    });

    dialog.afterClosed().subscribe(res => {
      if (!res) return
      const addControls = (control, Nombre) => {
        control.get('Nombre').setValue(Nombre);
        control.get('Coors').setValue(_coords);

      }

      let _coords = `${coors.lat},${coors.lng}`;
      switch (res) {
        case 'puntoInicio':
          /* this.puntoInicioCoors.setValue(_coords)
          this.puntoInicio.setValue('Punto Inicio') */
          const controlPI = this.puntosIntermedios.at(0)
          addControls(controlPI, 'Punto 1');
          break;
        case 'puntoFinal':
          const i = this.puntosIntermedios.length - 1
          const controlPF = this.puntosIntermedios.at(i)
          addControls(controlPF, 'Punto ' + (Number(i) + 1))
          break;
        case 'puntoIntermedio':
          this.addIntermediatePoint(coors);
          break;
        default:
          break;
      }
    })
  }

  private loadTarifasMensajeria(cityCode): void {
    if (this.subTM) this.subTM.unsubscribe();
    this.subTM = this.dbService.objectTarifas(cityCode, 'Mensajeria')
      .snapshotChanges()
      .map(res => {
        const TarifaMensajeria: ITarifasMensajeria = res.payload.val()
        return TarifaMensajeria
      })
      .subscribe((res: ITarifasMensajeria) => {
        this.TarifasMensajeria = res;
      })
  }

  private loadTarifasMensajeriaCustom(cityCode): void {
    const id = this.selectedCliente.$key;

    console.log(this.selectedCliente)
    if (this.subTMC) this.subTMC.unsubscribe();
    this.subTMC = this.dbService.objectTarifasCustom(cityCode, 'Mensajeria', id)
      .snapshotChanges()
      .map(res => {
        const TarifaMensajeria: ITarifasMensajeria = res.payload.val()
        return TarifaMensajeria
      })
      .subscribe((res: ITarifasMensajeria) => {
        this.TarifasMensajeriaCustom = res;
      })
  }

  buildForm() {

    this.form = this.formBuilder.group({
      puntosIntermedios: this.formBuilder.array([]),
    })
    this.addIntermediatePoint();
    this.addIntermediatePoint();
  }

  addIntermediatePoint(coords?) {
    const group = this.getFormGroupPoint(coords ? `${coords.lat},${coords.lng}` : null);
    this.puntosIntermedios.push(group)
    this.addListeners(group);

    if (coords) {
      let _control = `${this.puntosIntermedios.controls.indexOf(group)}`
      const _group: FormGroup = this.puntosIntermedios.at(Number(_control)) as FormGroup;
      _group.get('Nombre').setValue(`Punto ${(Number(_control) + 1)}`)
      _group.addControl('Coordenadas', this.formBuilder.group({
        Lat: coords.lat,
        Lng: coords.lng
      }))

      return
    }

  }

  onEditDetails(event) {
    this.isValidDetails = event.isValid;
    console.log(event)
    this.Details = event.value;

  }

  private addListeners(group: FormGroup): void {
    this.addListenerText(group, 'Nombre')
    this.addIsVueltaListener(group)
    this.addcoorsListener(group)
  }

  addListenerText(group: FormGroup, control: string) {
    this.subs.push(group.get(control)
      .valueChanges
      .debounceTime(2500)
      .distinctUntilChanged()
      .switchMap(address => {
        if (!address) return Observable.empty();

        const data = group.value;
        const answer = this.getSentence({ address }, 'api/google/geocode')
          .map(res => {
            if (res && res.data) return res.data;
            return null
          })
        if (data.Coors) {
          if (group.get('Coors').value) {
            return Observable.empty()
          }
          return answer
        }
        return answer
      })
      .map((res: any) => {
        if (res && res.results) return res.results[0];
        return null
      })
      .subscribe(val => {
        const notFound = (): void => {
          setTimeout(() => {
            group.get(control).setValue(null);
          }, 2000);
          group.removeControl('Coordenadas')
          this.notifyNotFoundCoords(group.get(control).value);
        }

        if (val) {
          const coors = val.geometry.location;

          if (Number(coors.lat) > 13 || Number(coors.lng) < -80) {
            notFound();
            return
          }

          group.get(`Coors`).setValue(`${coors.lat},${coors.lng}`)
          return
        }

        notFound();

      }, err => {
        console.log(err)
      }))
  }

  private addIsVueltaListener(group: FormGroup) {
    this.subs.push(
      group.get('Vuelta')
        .valueChanges
        .subscribe(val => {
          const label: string = 'PuntoAVolver';
          if (val) {

            return group.addControl(
              label,
              this.formBuilder
                .control(
                  this.puntosIntermedios.controls.indexOf(group) - 1,
                  Validators.required
                )
            )
          }
          group.removeControl(label)

        })
    )
  }

  addcoorsListener(group: FormGroup) {
    this.subs.push(
      group.get('Coors')
        .valueChanges
        .subscribe((val: string) => {
          if (!val) return

          const data = val.split(',').filter(data => { if (data) return data })
          const Lat: number = Number(data[0]);
          const Lng: number = Number(data[1]);

          const Coordenadas = group.get('Coordenadas')
          if (Coordenadas) return Coordenadas.setValue({ Lat, Lng });
          group.addControl('Coordenadas', this.formBuilder.group({ Lat, Lng }))

        })
    )
  }

  public removeIntermediatePoint(index): void {

    this.puntosIntermedios.removeAt(index);

    // Update Forms Name
    let _i = 0;
    this.puntosIntermedios.controls.forEach((_control: FormGroup) => {
      const Nombre = _control.get('Nombre')
      if (Nombre.value) {
        if (Nombre.value.indexOf('Punto') > -1) {
          Nombre.setValue(`Punto ${_i + 1}`)
        }
      }

      const Vuelta = _control.get('Vuelta')
      if (Vuelta && Vuelta.value) {
        const PuntoAVolver = _control.get('PuntoAVolver');
        PuntoAVolver.setValue(_i - 1)
      }
      _i++;
    })

  }

  private getFormGroupPoint(coords?): FormGroup {
    return this.formBuilder.group({
      Nombre: [null, [Validators.required]],
      Coors: [(coords ? coords : null), [Validators.required]],
      InformacionExtra: [null, [Validators.required]],
      QueDebeHacer: [null, [Validators.required]],
      Vuelta: [false, [Validators.required]]
    })
  }

  doQuote() {

    this.isQuoting = true;
    const key = environment.google.distanceMatrix;
    const points: IPunto[] = this.puntosIntermedios.value;
    let origins = '';
    let destinations = '';
    for (let i = 0; i < points.length; i++) {
      let point: IPunto = points[i];
      let nextPoint: IPunto = points[i + 1];

      if (i == 0) {
        origins += `${point.Coors}|`;
        destinations += `${nextPoint.Coors}|`;
      } else if (i > 0 && point) {
        if (point.Vuelta) {
          origins += `${point.Coors}|`;
          destinations += `${points[point.PuntoAVolver].Coors}|`;

          if (nextPoint) {
            origins += `${points[point.PuntoAVolver].Coors}|`;
            destinations += `${nextPoint.Coors}|`;
          }

        } else if (nextPoint) {
          origins += `${point.Coors}|`;
          destinations += `${nextPoint.Coors}|`;
        }
      }
    }
    this.loadRoute(origins, destinations);
    const body = { origins, destinations }
    const distanceMtrx$ = this.getSentence(body, 'api/google/distancematrix')
      .map((res: any) => {
        if (res || res.data) return res;
        return {}
      })

    // Load Tarifas
    const Tarifas: ITarifasMensajeria = this.TarifasMensajeriaCustom ?
      this.TarifasMensajeriaCustom :
      this.TarifasMensajeria;

    const profitMensajeroMensajeria$ = this.dbService.objectGanancias().valueChanges().first()
    const isOut$ = Observable.fromPromise(this.calcOvercostoutoftown(points, Tarifas))
    const data = Observable.forkJoin([distanceMtrx$, profitMensajeroMensajeria$, isOut$])


    this.subs.push(data.subscribe(res => {
      console.log(res)
      const distMatrx = res[0];
      const Profit: IGanancias = res[1];
      const isOut: boolean = res[2];

      this.isQuoting = true;
      const info = distMatrx.data.rows;
      let fullDistance: number = 0;
      let fullDuration: number = 0;

      for (let i = 0; i < info.length; i++) {
        const element = info[i];
        fullDistance += parseFloat(
          element.elements[i].distance.text.replace(',', '.'));
        fullDuration += Math.round(parseFloat(
          element.elements[i].duration.text.replace(',', '.')));
      }

      const lastPoint = (item: string): string => {
        const lastPoint: IPunto = Recorrido[Recorrido.length - 1];
        const isVuelta = lastPoint.Vuelta
        if (isVuelta) {
          return Recorrido[lastPoint.PuntoAVolver][item]
        }
        return lastPoint[item];
      }

      const Recorrido: IPunto[] = this.puntosIntermedios.value;
      const DistanciaTotal: number = Number(fullDistance) * 1000;
      const DistanciaRedondeada: number = Math.round(Math.round(Number(fullDistance)));
      const KmAdAlBase: number = DistanciaRedondeada - Tarifas.PrimerosKm.Km;
      const DuracionTotal: number = Number(fullDuration);
      const TipoServicio: string = 'Mensajeria';
      const RecargoKmAdi: number = Math.round(this.amountByAdKm(KmAdAlBase, Tarifas.KmAdicional))
      const ValorBase: number = Math.round(Tarifas.PrimerosKm.Costo);
      const SobreCostoFueraCiudad: number = Math.round(isOut ? Tarifas.SobreCostoFueraCiudad : 0);
      const RecargoParadas: number = Math.round((points.length - 2) * Tarifas.ParadaAdicional);
      const TiempoEspera: number = Math.round(0);
      const ValorAsegurado: number = Math.round(this.Details.ValorAAsegurar ? this.Details.ValorAAsegurar : 0);
      const SeguroAPagar: number = Math.round(this.Details.CobroAsegurar ? this.Details.CobroAsegurar : 0);
      const SubTotalAPagar: number = Math.round(ValorBase + RecargoKmAdi + SobreCostoFueraCiudad + RecargoParadas);
      const GananciaMensajero: number = Math.round(SubTotalAPagar * Profit.MensajeroMensajeria);
      const user_id: string = this.selectedCliente.$key;
      const MetodoDePago = this.Details.MetodoDePago ? this.Details.MetodoDePago : null;
      const DebeComprar = this.Details.DebeComprar ? this.Details.DebeComprar : null;
      const CodigoPromocional = this.Details.CodigoPromocional ? this.Details.CodigoPromocional : null;
      const Asegurar = this.Details.Asegurar ? this.Details.Asegurar : null;
      const FotoRecibido = this.Details.FotoRecibido ? this.Details.FotoRecibido : null;
      const FirmaRecibido = this.Details.FirmaRecibido ? this.Details.FirmaRecibido : null;
      const ComprarAlgo = this.Details.ComprarAlgo ? this.Details.ComprarAlgo : null;
      const Instrucciones = this.Details.Instrucciones ? this.Details.Instrucciones : null;
      const DetallesComprarAlgo = this.Details.DetallesComprarAlgo ? this.Details.DetallesComprarAlgo : null;
      const ValorDescuento: number = Math.round(this.Details.ValorDescuento ? this.Details.ValorDescuento : 0);
      const TotalDescuento: number = Math.round(SubTotalAPagar * ValorDescuento);
      const TotalAPagar: number = Math.round((SubTotalAPagar - TotalDescuento) + SeguroAPagar);
      const puntoInicialCoors: string = Recorrido[0].Coors;
      const puntoInicio: string = Recorrido[0].Nombre;
      const puntoFinal: string = lastPoint('Nombre');
      const puntoFinalCoors: string = lastPoint('Coors');
      const Estado: string = ESTADOS_SERVICIO.Pendiente;
      const codigoCiudad: string = this.selectedCity.Codigo.toString();
      const esPagoConTarjeta: boolean = false;

      this.Servicio = {
        Recorrido, DistanciaTotal, DistanciaRedondeada, KmAdAlBase,
        DuracionTotal, TipoServicio, RecargoKmAdi, ValorBase,
        SobreCostoFueraCiudad, RecargoParadas, TotalAPagar,
        TiempoEspera, ValorAsegurado, SeguroAPagar, user_id,
        MetodoDePago, DebeComprar, CodigoPromocional, Asegurar,
        FotoRecibido, FirmaRecibido, ComprarAlgo, Instrucciones,
        DetallesComprarAlgo, SubTotalAPagar, ValorDescuento, TotalDescuento,
        GananciaMensajero, puntoInicialCoors, puntoFinal, puntoFinalCoors,
        puntoInicio, Estado, codigoCiudad, esPagoConTarjeta
      }

      this.loadTravelSummary(this.Servicio.Recorrido);

      this.isQuoting = false;
      this.isQuoteCompleted = true;
    }, err => {
      this.isQuoting = false;
      this.isQuoteCompleted = true;
      console.log(err)
    }))



  }

  private loadTravelSummary(points: IPunto[]){
    this.TravelSummary = [];
    points.forEach(point => {
      this.TravelSummary.push(point)
      if (point.Vuelta) this.TravelSummary.push(points[point.PuntoAVolver])
    })

    console.log(this.TravelSummary)
    console.log(this.TravelSummary.length)
  }

  private loadRoute(origins: string, destinations: string) {
    const points: string[] = origins.split('|')
      .concat(destinations.split('|'))
      .filter(item => { if (item) return item })
    this.Directions = [];
    const origin: string = `${points.shift()}`;
    const destination: string = `${points.splice(-1, 1)}`;
    const waypoints: string = points.join('|');
    const mode: string = 'driving'
    const language: string = 'es'
    const body = { origin, destination, waypoints, mode, language }

    this.subs.push(this.getSentence(body, 'api/google/directions')
      .map(res => {
        if (res && res.data) return res.data;
        return null
      })
      .subscribe(res => {
        if (res) {
          if (res.routes) {
            const route: any = res.routes[0];
            const legs: any[] = route.legs;
            legs.forEach(leg => {
              const steps: any[] = leg.steps;
              steps.forEach(step => {
                this.Directions.push(step.start_location)
                this.Directions.push(step.end_location)
              })
            })
          }
        } else {
          console.log("Error al encontrar la dirección")
        }
      }, err => {
        console.log(err)
      }))
  }

  /**
   * Calculate amount to pay by aditional Km
   * 
   * @private
   * @param {number} distance 
   * @param {number} ValueAdKm 
   * @returns {number} 
   * @memberof MensajeriaFormComponent
   */
  private amountByAdKm(distance: number, ValueAdKm: number): number {
    let amount: number = 0;
    while (distance > 0) {
      amount += ValueAdKm
      distance--;
    }

    return amount;
  }

  /**
   * Calculate amount to pay by aditional stop
   * 
   * @private
   * @param {number} aditionalStop 
   * @param {number} AmountAdStop 
   * @returns {number} 
   * @memberof MensajeriaFormComponent
   */
  private amountByAditionalStop(aditionalStop: number, AmountAdStop: number): number {
    return aditionalStop * AmountAdStop
  }

  private getSentence(body: any, api: string): Observable<any> {
    const token$ = Observable.fromPromise(this.authService.userState.getIdToken())
    return token$.switchMap(token => {
      body.idToken = token
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      const url: string = `${environment.baseapi.tuvuelta}${api}`
      return this.http.post(url, body, httpOptions)
    })

  }

  /**
   * Check if any one direction is out of town;
   * 
   * @private
   * @param {IPunto[]} Points Array with points which must visit.
   * @param {ITarifasMensajeria} Tarifas 
   * @returns {Promise<boolean>} 
   * @memberof MensajeriaFormComponent
   */
  private calcOvercostoutoftown(Points: IPunto[], Tarifas: ITarifasMensajeria): Promise<boolean> {
    this.isQuoting = true;
    let overCost: number = 0;
    const key: string = environment.google.geocoding;
    const _request: Promise<any>[] = Points.map(point => {
      const latlng = point.Coors;
      const result_type = 'locality';
      return this.getSentence({ latlng, result_type }, 'api/google/geocode')
        .map(res => {
          if (res && res.data) return res.data;
          return null
        })
        .map((res: any) => {
          if (res && res.results && res.status == "OK") return res.results
          return []
        })
        .toPromise()
    })

    return Promise.all(_request).then((snap: any[]) => {
      const prefix = this.getCleanedString(this.selectedCity.Prefijo);
      const Nombre = this.getCleanedString(this.selectedCity.Nombre);
      let hasPrefix: boolean = false;
      snap.forEach(_res => {
        _res.forEach(item => {
          if (item.address_components) {
            const address_components: any[] = item.address_components;

            if (this.getCleanedString(item.formatted_address).indexOf(prefix) == -1)
              hasPrefix = true;
          }
        });
      });
      return Promise.resolve(hasPrefix)
    })
  }

  private getCleanedString(cadena: string): string {
    // Definimos los caracteres que queremos eliminar
    let specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.";

    // Los eliminamos todos
    for (let i = 0; i < specialChars.length; i++) {
      cadena = cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }

    // Lo queremos devolver limpio en minusculas
    cadena = cadena.toLowerCase();

    // Quitamos espacios y los sustituimos por _ porque nos gusta mas asi
    cadena = cadena.replace(/ /g, "_");

    // Quitamos acentos y "ñ". Fijate en que va sin comillas el primer parametro
    cadena = cadena.replace(/á/gi, "a");
    cadena = cadena.replace(/é/gi, "e");
    cadena = cadena.replace(/í/gi, "i");
    cadena = cadena.replace(/ó/gi, "o");
    cadena = cadena.replace(/ú/gi, "u");
    cadena = cadena.replace(/ñ/gi, "n");
    return cadena.toLowerCase();
  }

  doNewSolicitud() {
    this.isStepEditable = true;
    this.stepper.selectedIndex = 0;
    this.form.reset();
    setTimeout(() => {
      this.stepper.selectedIndex = 0;
    }, 100);

    setTimeout(() => {
      this.isStepEditable = true;
      this.isQuoteCompleted = false;
      this.stepper._stateChanged();
      this.subs.forEach(sub => sub.unsubscribe());
      this.buildForm();
      this.stepper.linear = true;
    }, 1000);

  }



  private notifyNotFoundCoords(location): ActiveToast {
    const message: string = `No se encontró la ubicacion <strong>${location}</strong>`;
    const title: string = `Ubicación no encontrada`;
    const config: Partial<IndividualConfig> = {
      progressBar: true,
      closeButton: true,
      timeOut: 3000,
      positionClass: 'toast-center-center',
      disableTimeOut: false
    }
    return this.toastr.warning(message, title, config)
  }

  /**
   * Remove coors.
   * Is used in DOM keyup for each direction. so, it mmust remove the coors.
   * 
   * @param {string} control 
   * @param {number} i 
   * @memberof MensajeriaFormComponent
   */
  public removeCoors(control: string, i: number): void {
    this.puntosIntermedios.get(i + '').get('Coors').setValue(null)
    const group: FormGroup = this.puntosIntermedios.get(i + '') as FormGroup;
    group.removeControl('Coordenadas')
  }

  onSelectionChange(event): void {
    const selectedIndex: number = event.selectedIndex;
    if (selectedIndex == 1) {

    } else if (selectedIndex == 2) {
      if (event.previouslySelectedIndex == 0) {
        setTimeout(() => {
          this.stepper.selectedIndex = 1
        }, 500);
      } else {
        /* this.isStepEditable = false; */
        this.doQuote();
      }
    } else if (selectedIndex == 3) {
      const key: string = new Date().getTime().toString();
      console.log(this.Servicio)
      this.isSaving$.next(true);
      this.dbService.objectSolicitud(key)
        .update(this.Servicio)
        .then(res => {
          this.isSaving$.next(false);
          this.isStepEditable = false;
          this.messageSaved = `El servicio se ha guardado con <strong>Exito!</strong>`;
        })
        .catch(err => {
          this.isSaving$.next(false);
          this.messageSaved = `Algo salio mal y <strong>no se creó la solicitud</strong>`;
          console.log(err)
        })
    }
  }

  get puntosIntermedios() { return this.form.get('puntosIntermedios') as FormArray }

}

@Component({
  selector: 'dialog-DialogOnClickMap',
  template: `
  <mat-radio-group [(ngModel)]="selectedOption">
    <mat-radio-button class="example-margin" value="puntoInicio">Punto Inicio</mat-radio-button>
    <mat-radio-button class="example-margin" value="puntoFinal">Punto Final</mat-radio-button>
    <mat-radio-button class="example-margin" value="puntoIntermedio">Agregar al Final Intermedio</mat-radio-button>
  </mat-radio-group>

  <div class="text-center">
    <button mat-button color="warn" (click)="onNoClick()">Cancelar</button>
    <button mat-button [disabled]="!selectedOption" (click)="onSelection()">Agregar Punto</button>
  </div>
  `,
})
export class DialogOnClickMap implements OnInit {
  public form: FormGroup;
  public selectedOption = null;
  constructor(
    public dialogRef: MatDialogRef<DialogOnClickMap>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSelection() {
    this.dialogRef.close(this.selectedOption)
  }

  ngOnInit() {
    this.selectedOption = null;
  }

}

interface IMarker {
  lat: number;
  lng: number;
  title: string;
  control: string | number;
}

interface IPunto {
  Nombre: string;
  Coors: string;
  InformacionExtra: string;
  QueDebeHacer: string;
  Vuelta: boolean;
  PuntoAVolver?: number;
}

class IServicioMensajeria {
  public Recorrido: IPunto[];
  public DistanciaTotal: number;
  public DistanciaRedondeada: number;
  public KmAdAlBase: number;
  public DuracionTotal: number;
  public TipoServicio: string;
  public RecargoKmAdi: number;
  public ValorBase: number;
  public SobreCostoFueraCiudad: number;
  public RecargoParadas: number;
  public TotalAPagar: number;
  public TiempoEspera: number;
  public ValorAsegurado: number;
  public SeguroAPagar: number;
  public user_id: string;
  public MetodoDePago;
  public DebeComprar;
  public CodigoPromocional;
  public Asegurar;
  public FotoRecibido;
  public FirmaRecibido;
  public ComprarAlgo;
  public Instrucciones;
  public DetallesComprarAlgo;
  public ValorDescuento: number;
  public SubTotalAPagar: number;
  public TotalDescuento: number;
  public GananciaMensajero: number;
  public puntoInicio: string;
  public puntoInicialCoors: string;
  public puntoFinal: string;
  public puntoFinalCoors: string;
  public Estado: string;
  public codigoCiudad: string;
  public esPagoConTarjeta: boolean;
}