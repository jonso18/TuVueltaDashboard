import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DbService } from '../../../services/db/db.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { ICiudad } from '../../../interfaces/ciudad.interface';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent implements OnInit, OnDestroy {

  public Cities$: Observable<ICiudad[]>;
  public subs: Subscription[] = [];
  public form: FormGroup;
  public citySelected: ICiudad;
  public hasDomicilios: boolean = false;
  public hasMensajeria: boolean = false;

  constructor(
    private dbService: DbService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Load initial data.
   * @returns void
   */
  ngOnInit(): void {
    this.Cities$ = this.dbService.listCiudades();
  }

  /**
   * Will remove all subscriptions in the component.
   * @returns void
   */
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * This event only work when user click on a city showed in the select box
   * So, this will get data from database and build the form.
   * 
   * @param  {ICiudad} Ciudad
   * @returns void
   */
  onClickCity(Ciudad: ICiudad): void {
    
    this.form = null;
    this.subs.push(
      this.dbService
        .objectTarifasByCitySnap(Ciudad.Codigo.toString())
        .subscribe(res => {
          this.buildForm();
          
          console.log(res)
          if (res) {
            if (res.Domicilios && res.Domicilios.Tarifas) {
              console.log('patching value to domiclios')
              this.Dom.patchValue(res.Domicilios);
              this.hasDomicilios = true;
            } else {
              this.hasDomicilios = false;
            }
            if (res.Mensajeria && res.Mensajeria.Tarifas) {
              this.MenT.patchValue(res.Mensajeria.Tarifas)
              this.hasMensajeria = true;
            } else {
              this.hasMensajeria = false;
            }
          }else {
            this.hasDomicilios = false;
            this.hasMensajeria = false;
          }
        })
    )
  }


  /**
   * Build the form with the the estructure of Tarifas in the database
   * @returns void
   */
  private buildForm(): void {
    const tarifasDomicilios: FormGroup = this.formBuilder.group({});
    const tarifasMensajeria: FormGroup = this.formBuilder.group({});
    this.form = this.formBuilder.group({
      Domicilios: this.formBuilder.group({
        Tarifas: tarifasDomicilios
      }),
      Mensajeria: this.formBuilder.group({
        Tarifas: tarifasMensajeria
      })
    })
    this.addControlTarifasDomicilios(tarifasDomicilios);
    this.addControlTarifasMensajeria(tarifasMensajeria);
  }

  /**
   * Recive the formGroup tarifasMensajeria to organize the form 
   * according the structure on the database. Mensajeria as the other
   * bussines types on this project has an especial rules an all of them
   * are necesiry have a control.
   * 
   * @param  {FormGroup} tarifasMensajeria
   * @returns void
   */
  private addControlTarifasMensajeria(tarifasMensajeria: FormGroup): void {
    tarifasMensajeria.addControl('Cancelacion',
      this.formBuilder.control(null,
        [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]))
    tarifasMensajeria.addControl('KmAdicional',
      this.formBuilder.control(null,
        [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]))
    tarifasMensajeria.addControl('ParadaAdicional',
      this.formBuilder.control(null,
        [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]))
    tarifasMensajeria.addControl('SobreCostoFueraCiudad',
      this.formBuilder.control(null,
        [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]))
    tarifasMensajeria.addControl('PrimerosKm',
      this.formBuilder.group({
        Costo: this.formBuilder.control(null,
          [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]),
        Km: this.formBuilder.control(null,
          [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')])
      }))
  }
  /**
   * Receive a form group named tarifasDomicilios to add controls
   * for the local form and load the tarifas structucture alocated 
   * in the database.
   * This too add some listener for changes to each input to validate rules
   * like:
   *  - tarifa2 minKm can't be smaller than tarifa2 maxKm
   *  - tarifa3 minKm can't be smaller than tarifa2 minKm
   *  - every value must be numeric
   *  - tarifa2 maxKm can't be greater than tarifa3 minKm
   * 
   * If some rule is not correct, the observables will modify the data.
   * 
   * @param  {FormGroup} tarifasDomicilios
   * @returns void
   */
  private addControlTarifasDomicilios(tarifasDomicilios: FormGroup): void {
    const tarifa1: FormGroup = this.formBuilder.group({
      maxKm: [null,
        [Validators.required, Validators.min(1), Validators.pattern('^(0|[1-9][0-9]*)$')]],
      minKm: [0],
      value: [null,
        [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
    })

    const tarifa2: FormGroup = this.formBuilder.group({
      maxKm: [null,
        [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      minKm: [null],
      value: [null,
        [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
    })

    const tarifa3: FormGroup = this.formBuilder.group({
      minKm: [null],
      value: [null,
        [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]]
    })

    tarifasDomicilios.addControl('Tarifa1', tarifa1)
    tarifasDomicilios.addControl('Tarifa2', tarifa2)
    tarifasDomicilios.addControl('Tarifa3', tarifa3)

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
  }

  onUpdateDomicilios() {
    if (this.Dom.valid) {
      const cityCode: string = this.citySelected.Codigo.toString();
      const body: any = this.DomT.value;
      const p_token: Promise<string> = this.getToken();
      p_token.then((token: string) => {
        const url: string = `${environment.firebase.databaseURL}/Administrativo/TipoServicio/${cityCode}/Domicilios/Tarifas.json?auth=${token}`;
        return this.http.patch(url, body).toPromise();
      }).then(res => {
        this.snackBar.open(`Tarifas Domicilios ${this.hasDomicilios ? 'Actualizadas' : 'Creadas'}`, 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      })

    }
  }

  onUpdateMensajeria() {
    if (this.Men.valid) {
      const cityCode: string = this.citySelected.Codigo.toString();
      const body: any = this.MenT.value;
      const p_token: Promise<string> = this.getToken();
      p_token.then((token: string) => {
        const url: string = `${environment.firebase.databaseURL}/Administrativo/TipoServicio/${cityCode}/Mensajeria/Tarifas.json?auth=${token}`;
        return this.http.patch(url, body).toPromise();
      }).then(res => {
        this.snackBar.open(`Tarifas Mensajeria ${this.hasDomicilios ? 'Actualizadas' : 'Creadas'}`, 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      })
    }
  }

  onRemove(service: string){
    this.getToken().then(token => {
      const cityCode: string = this.citySelected.Codigo.toString();
      const url:string = `${environment.firebase.databaseURL}/Administrativo/TipoServicio/${cityCode}/${service}/Tarifas.json?auth=${token}`;
      return this.http.delete(url).toPromise();
    }).then(res=> {
      this.snackBar.open(`Tarifas ${service} de  ${this.citySelected.Nombre} Eliminada`, 'Ok', {
        duration: 3000,
        verticalPosition: 'top'
      })
    })
  }

  getToken(): Promise<string>{
    return this.authService.userState.getIdToken();
  }



  /* Servicios */
  get Dom() { return this.form.get('Domicilios') as FormGroup }
  get Men() { return this.form.get('Mensajeria') as FormGroup }

  /* Tarifas */
  get DomT() { return this.Dom.get('Tarifas') as FormGroup }
  get MenT() { return this.Men.get('Tarifas') as FormGroup }

  /* Tarfias Domicilios */
  get T1() { return this.DomT.get('Tarifa1') as FormGroup }
  get T2() { return this.DomT.get('Tarifa2') as FormGroup }
  get T3() { return this.DomT.get('Tarifa3') as FormGroup }

  get T1minKm() { return this.T1.get('minKm') }
  get T1maxKm() { return this.T1.get('maxKm') }
  get T1value() { return this.T1.get('value') }
  get T2minKm() { return this.T2.get('minKm') }
  get T2maxKm() { return this.T2.get('maxKm') }
  get T2value() { return this.T2.get('value') }
  get T3minKm() { return this.T3.get('minKm') }
  get T3value() { return this.T3.get('value') }
}
