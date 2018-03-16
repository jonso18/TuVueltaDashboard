import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { DbService } from '../../../services/db/db.service';
import { IBonoDescuento } from '../../../interfaces/bono-descuento.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from "rxjs/Observable";
import { environment } from '../../../../environments/environment';
import { MatDatepickerInputEvent, MatSnackBar } from '@angular/material';
import { MessagesService } from '../../../services/messages/messages.service';
@Component({
  selector: 'app-bonos-mensajeria',
  templateUrl: './bonos-mensajeria.component.html',
  styleUrls: ['./bonos-mensajeria.component.css']
})
export class BonosMensajeriaComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public subList: Subscription;
  public subBonus: Subscription;
  private subs: Subscription[] = [];
  public message: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private http: HttpClient,
    private authService: AuthService,
    private messages: MessagesService,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadInfo();
  }

  ngOnDestroy() {
    if (this.subBonus) this.subBonus.unsubscribe();
    if (this.subList) this.subList.unsubscribe();
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private loadInfo(): void {
    this.subBonus = this.dbService.listBonoDescuento()
      .do(res => this.loading$.next(true))
      .debounceTime(500)
      .do(res => this.loading$.next(false))
      .distinctUntilChanged()
      .subscribe(bonus => this.buildForm(bonus))
  }

  private buildForm(Bonus: IBonoDescuento[]): void {
    this.form = this.formBuilder.group({
      noDuplicated: [true, Validators.requiredTrue],
      list: this.formBuilder.array([])
    })
    Bonus.forEach(bonus => this.addBonus(bonus))
    this.noRepeatKey();
  }

  private noRepeatKey(): void {
    if (this.subList) this.subList.unsubscribe();
    this.subList = this.list
      .valueChanges
      
      .distinctUntilChanged()
      .subscribe((bonus: IBonoDescuento[]) => {
        let isDuplicated: number = 0;
        for (let i = 0; i < bonus.length; i++) {
          for (let j = 0; j < bonus.length; j++) {
            console.log(`${bonus[i].Clave} == ${bonus[j].Clave}`)
            if (bonus[i].Clave == bonus[j].Clave) isDuplicated++;
          }
        }
        if (isDuplicated > bonus.length) {
          this.message = `
          <div class="alert alert-warning" role="alert">
            No se admiten claves repetidas   
          </div>
          `
          return this.noDuplicated.patchValue(false)
        }
        this.message = '';
        return this.noDuplicated.patchValue(true)
      })

      
  }

  public addBonus(bonus?: IBonoDescuento) {
    const group: FormGroup = this.formBuilder.group({
      Clave: [(bonus ? bonus.Clave : null), [Validators.required]],
      Descuento: [(bonus ? bonus.Descuento : null), [Validators.required, Validators.min(0), Validators.max(1)]],
      Fin: [(bonus ? bonus.Fin : null), [Validators.required]],
      FinDate: [(bonus ? new Date(bonus.Fin) : null), [Validators.required]],
      Inicio: [(bonus ? bonus.Inicio : null), [Validators.required]],
      InicioDate: [(bonus ? new Date(bonus.Inicio) : null), [Validators.required]],
      Nombre: [(bonus ? bonus.Nombre : null), [Validators.required]],
    });
    this.list.push(group);

    if (bonus) group.patchValue(bonus)
  }

  public removeBonus(i: number): void {
    this.list.removeAt(i)
  }

  public onSubmit() {
    const isValid: boolean = this.form.valid;
    if (isValid) {
      this.subs.push(Observable.fromPromise(this.authService.userState.getIdToken())
        .switchMap((idToken: string) => this.updateBonus(idToken))
        .subscribe(res => {
          this.snack.open('Actualziación exitosa', 'Ok', {
            verticalPosition: 'top',
            duration: 3000
          })
        }, err => {
          console.log('error al actualizar bonos de descuento ', err)
          this.snack.open('No se Actualizó correctamente', 'Ok', {
            verticalPosition: 'top',
            duration: 3000
          })

          this.message = `
          <div class="alert alert-danger" role="alert">
            Error al actualizar la informacion.
          </div>
          `
        }))

    }
  }

  private updateBonus(idToken: string): Observable<any> {
    const url: string = `${environment.firebase.databaseURL}/Administrativo/BonosDescuento.json?auth=${idToken}`;
    const data = this.list.value;
    data.forEach(bonus => {
      delete bonus.InicioDate
      delete bonus.FinDate
    })
    let body: IBonoDescuento[] = data;
    console.log(data)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.put(url, body, httpOptions)
  }

  public onDateChange(event: MatDatepickerInputEvent<Date>, i: number, label: string): void {
    const date: number = event.value.getTime();
    this.list.at(i).get(label).patchValue(date)
  }

  public getErrorMessage(control: FormControl) {
    return this.messages.getErrorMessage(control)
  }

  get list() { return this.form.get('list') as FormArray }
  get noDuplicated() { return this.form.get('noDuplicated') }
}
