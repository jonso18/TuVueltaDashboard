import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Subscription } from 'rxjs/Subscription';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatHorizontalStepper } from '@angular/material';
import { LatLngLiteral } from '@agm/core';
import { Observable } from 'rxjs/Rx';
import { DbService } from '../../services/db/db.service';
import { ITarifasMensajeria } from '../../interfaces/tarifas.interfaces';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-mensajeria-form',
  templateUrl: './mensajeria-form.component.html',
  styleUrls: ['./mensajeria-form.component.css']
})
export class MensajeriaFormComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  lat: number = 4.433;
  lng: number = -75.217;
  public form: FormGroup;
  private subs: Subscription[] = [];
  public markers: IMarker[] = []
  public isMapReady: boolean = false;
  public points = [];
  public isStepEditable: boolean = true;
  public isQuoteCompleted: boolean = false;
  public TarifasMensajeria: ITarifasMensajeria;
  public TarifasMensajeriaCustom: ITarifasMensajeria;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private dbService: DbService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadTarifasMensajeria();
    this.loadTarifasMensajeriaCustom();
    this.buildForm();
  }
  ngOnDestroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }



  onMapClick(event) {
    const coors: LatLngLiteral = event.coords;

    console.log(coors)
    const dialog = this.dialog.open(DialogOnClickMap, {
      width: '250px',
      data: {}
    });

    dialog.afterClosed().subscribe(res => {
      if (!res) {
        console.log("No hay selección");
        return
      }
      let _coords = `${coors.lat},${coors.lng}`;
      switch (res) {
        case 'puntoInicio':
          /* this.puntoInicioCoors.setValue(_coords)
          this.puntoInicio.setValue('Punto Inicio') */
          const controlPI = this.puntosIntermedios.at(0)
          controlPI.get('Nombre').setValue('Punto 1');
          controlPI.get('Coors').setValue(_coords);
          break;
        case 'puntoFinal':
          const i = this.puntosIntermedios.length - 1
          const controlPF = this.puntosIntermedios.at(i)
          controlPF.get('Nombre').setValue('Punto ' + (Number(i) + 1));
          controlPF.get('Coors').setValue(_coords)
          break;
        case 'puntoIntermedio':
          this.addIntermediatePoint(coors);
          break;
        default:
          break;
      }
    })
  }


  loadTarifasMensajeria(cityCode = 11001) {
    this.dbService.objectTarifas(cityCode, 'Mensajeria')
      .snapshotChanges()
      .map(res => {
        const TarifaMensajeria: ITarifasMensajeria = res.payload.val()
        return TarifaMensajeria
      })
      .subscribe((res: ITarifasMensajeria) => {
        this.TarifasMensajeria = res;
      })
  }

  loadTarifasMensajeriaCustom(cityCode = 11001) {
    const id = this.authService.userState.uid;
    this.dbService.objectTarifasCustom(cityCode, 'Mensajeria', id)
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
    this.subs.push(this.form.valueChanges
      .subscribe(res => {

        const val = this.puntosIntermedios.value;
        this.markers = [];
        let centinel: number = 0;
        val.forEach(place => {

          if (place.Coors) {
            const Coors: string = place.Coors;
            const Nombre: string = place.Nombre;
            const _Coors = Coors.split(',').map(Number);
            this.markers.push({
              lat: _Coors[0],
              lng: _Coors[1],
              title: `Punto ${Number(centinel) + 1}`,
              control: `Nombre${centinel}`
            })
          }
          centinel++;
        })
      }))

  }

  addIntermediatePoint(coords?) {
    const group = this.getFormGroupPoint(coords ? `${coords.lat},${coords.lng}` : null);
    this.puntosIntermedios.push(group)
    this.addListenerText(group, 'Nombre')

    if (coords) {
      let _control = `${this.puntosIntermedios.controls.indexOf(group)}`
      this.puntosIntermedios.at(Number(_control)).get('Nombre').setValue(`Punto ${(Number(_control) + 1)}`)
      return
    }

  }

  removeIntermediatePoint(index) {
    const control = this.puntosIntermedios.at(index)
    let coors = `Nombre${index}`;
    console.log(control)
    const i = this.markers.findIndex(x => x.control == coors)
    if (i > -1) {
      this.markers.splice(i, 1);
    }
    this.puntosIntermedios.removeAt(index);
    let _i = 0;

    // Update markers name
    this.markers.forEach(marker => {
      if (marker.control != 'puntoInicio' && marker.control != 'puntoFinal') {
        marker.control = `Nombre${_i++}`
        if (marker.title.indexOf('Punto') > -1) {
          marker.control = `Punto ${_i}`
          marker.title = `Punto ${_i}`
        }
      }
    })

    // Update Forms Name
    _i = 0;
    this.puntosIntermedios.controls.forEach(control => {
      let Nombre = control.get('Nombre')
      if (Nombre.value) {
        if (Nombre.value.indexOf('Punto') > -1) {
          Nombre.setValue(`Punto ${_i + 1}`)
        }
      }
      _i++;
    })

  }

  getFormGroupPoint(coords?): FormGroup {
    return this.formBuilder.group({
      Nombre: [null, [Validators.required]],
      Coors: [(coords ? coords : null), [Validators.required]],
      InformacionExtra: [null, [Validators.required]],
      QueDebeHacer: [null, [Validators.required]],
      Vuelta: [false, [Validators.required]]
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.doQuote();
    }
  }

  public Servicio: IServicioMensajeria;

  doQuote() {
    console.log("doing quote")
    const key = environment.google.distanceMatrix;
    const points = this.puntosIntermedios.value;
    let origins = '';
    let destinations = '';
    for (let i = 0; i < points.length; i++) {
      let element = points[i];
      if (points[i] && points[i + 1]) {
        origins += `${points[i].Coors}|`;
        destinations += `${points[i + 1].Coors}|`;

        if (points[i + 1].Vuelta) {
          origins += `${points[i + 1].Coors}|`;
          destinations += `${points[i].Coors}|`;
        }
      }

    }
    const url: string = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${key}`;
    this.http.get(url)
      .map((res: any) => {
        if (res || res.rows) return res;
        return {}
      }).subscribe(res => {
        if (res) {
          const info = res.rows;
          let fullDistance: number = 0;
          let fullDuration: number = 0;
          for (let i = 0; i < info.length; i++) {
            const element = info[i];
            fullDistance += parseFloat(
              element.elements[i].distance.text.replace(',', '.')) + 0.0000000001;
            fullDuration += parseFloat(
              element.elements[i].duration.text.replace(',', '.'));
          }

          // Calc Amount to pay


          console.log(`Full Distancia ${fullDistance}`)

          this.Servicio = {
            Recorrido: this.puntosIntermedios.value,
            DistanciaTotal: Number(fullDistance),
            DuracionTotal: Number(fullDuration),
            TipoServicio: 'Mensajeria',
            TotalAPagar: this.calcAmount(fullDistance, (points.length-2))
          }
          console.log(this.Servicio)

          this.isQuoteCompleted = true;

        } else {
          this.isQuoteCompleted = false;
        }


      }, err => {
        console.log(err)
        this.isQuoteCompleted = false;
      })
  }

  private calcAmount(fullDistance: number, aditionalStop: number): number {
    let amountToPay: number = 0;
    const Tarifas: ITarifasMensajeria = this.TarifasMensajeriaCustom ?
      this.TarifasMensajeriaCustom :
      this.TarifasMensajeria;
    let distance = fullDistance;

    // Apply Tarifas by distance
    amountToPay += Tarifas.PrimerosKm.Costo;
    distance -= Tarifas.PrimerosKm.Km;
    while (distance > 0) {
      amountToPay += Tarifas.KmAdicional;
      distance -= 1;
    }

    // Apply Tarifas by Parada Adicional
    amountToPay +=aditionalStop*Tarifas.ParadaAdicional;

    return amountToPay;
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

  addListenerText(group: FormGroup, control: string) {
    this.subs.push(group.get(control)
      .valueChanges
      .debounceTime(2500)
      .distinctUntilChanged()
      .switchMap(val => {
        const url: string = `https://maps.googleapis.com/maps/api/geocode/json?address=${val}&key=${environment.google.geocoding}`;
        const data = group.value;
        if (data.Coors) {
          if (group.get('Coors').value) {
            return Observable.empty()
          }
          return this.http.get(url)
        }
        return this.http.get(url)
      })
      .map((res: any) => {
        if (res && res.results) return res.results[0];
        return {}
      })
      .subscribe(val => {
        if (val) {
          if (control.indexOf('Coors') == -1) {
            // Get coordenates
            const coors = val.geometry.location;
            if (control == 'Nombre') {
              group.get(`Coors`).setValue(`${coors.lat},${coors.lng}`)
            } else {
              group.get(`${control}Coors`).setValue(`${coors.lat},${coors.lng}`)
            }
          }
        }
        else {
          alert(`No se pudo encontrar la ubicación ${group.get(control).value}`)
          group.get(control).setValue(null);
        }
      }, err => {
        console.log(err)
      }))
  }


  removeCoors(control, i?) {
    console.log(`control: ${control} i: ${i}`)
    if (typeof i == 'number') {
      this.puntosIntermedios.get(i + '').get('Coors').setValue(null)
      return
    }
    this.form.get(`${control}Coors`).setValue(null)
  }

  test(event) {
    console.log(this.stepper)
    console.log(event)
    const selectedIndex: number = event.selectedIndex;
    if (selectedIndex == 1) {
      this.doQuote();
    } else if (selectedIndex == 2) {
      this.isStepEditable = false;
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
    <mat-radio-button class="example-margin" value="puntoIntermedio">Punto Intermedio</mat-radio-button>
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
}

class IServicioMensajeria {
  public Recorrido: IPunto[];
  public DistanciaTotal: number;
  public DuracionTotal: number;
  public TipoServicio: string;
  public TotalAPagar?: number;
  public ValorDomicilio?: number;
}