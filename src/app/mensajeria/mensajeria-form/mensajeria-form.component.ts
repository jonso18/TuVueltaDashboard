import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Subscription } from 'rxjs/Subscription';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { LatLngLiteral } from '@agm/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-mensajeria-form',
  templateUrl: './mensajeria-form.component.html',
  styleUrls: ['./mensajeria-form.component.css']
})
export class MensajeriaFormComponent implements OnInit, OnDestroy {

  lat: number = 4.433;
  lng: number = -75.217;
  public form: FormGroup;
  private subs: Subscription[] = [];
  public markers: IMarker[] = []
  public isMapReady: boolean = false;
  public points = [];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
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

  buildForm() {
    this.form = this.formBuilder.group({
      puntosIntermedios: this.formBuilder.array([]),
    })
    this.addIntermediatePoint();
    this.addIntermediatePoint();

    this.form.valueChanges

      .subscribe(res => {

        const val = this.puntosIntermedios.value;
        this.markers = [];
        let centinel: number = 0;
        val.forEach(place => {

          if (place.Coors) {
            const Coors: string = place.Coors;
            const Nombre: string = place.Nombre;
            console.log(place)
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
      })

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
      InformacionExtra: [null],
      QueDebeHacer: [null],

    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.doQuote();
    }
  }

  doQuote() {
    console.log("doing quote")
    const key = environment.google.distanceMatrix;
    const points = this.puntosIntermedios.value;
    let origins = '';
    let destinations = '';
    for (let i = 0; i < points.length; i++) {
      let element = points[i];
      if (points[i] && points[i + 1]) {
        origins += `${points[i].Coors}`;
        destinations += `${points[i + 1].Coors}`;
      }

    }
    const url: string = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${key}`;
    this.http.get(url).toPromise().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
      
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
          alert(`No se pudo encontrar la ubicación de ${control}`)
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
