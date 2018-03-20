import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth/auth.service';
import { Observable } from "rxjs/Observable";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-id-ter-no-per',
  templateUrl: './id-ter-no-per.component.html',
  styleUrls: ['./id-ter-no-per.component.css']
})
export class IdTerNoPerComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  public listNoAllow: string[];
  public form: FormGroup;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public message: string = ``;
  constructor(
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.buildForm();
    this.noRepeatKeys();

    this.subs.push(this.db.list(`/Administrativo/IdTerNoPer`).valueChanges().subscribe((res: string[]) => {
      this.form.removeControl('List')
      this.form.addControl('List', this.formBuilder.array([]))
      this.listNoAllow = res;
      this.listNoAllow.forEach(key => this.addItem(key))

    }))
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private cleanList(): void {
    for (let i = 0; i <= this.List.value.length; i++) {
      console.log("deleting item ", i)
      this.List.removeAt(i);
    }
  }

  public onSubmit(): void {
    const isValid: boolean = this.form.valid;
    if (isValid) {
      this.subs.push(this.getIdToken().switchMap(idToken => this.update(idToken)).subscribe(res => {
        this.snackBar.open('Información Actualizada', 'Ok', {
          verticalPosition: 'top',
          duration: 3000
        })
      }, err => {
        this.message = `
        <div class="alert alert-danger">
          <strong>Error</strong> Error en el sistema y no se pudo actualizar.
        </div>
        `;
      }))
    }
  }

  private getIdToken(): Observable<string> {
    return Observable.fromPromise(this.authService.userState.getIdToken());
  }


  private update(idToken: string): Observable<any> {
    const url: string = `${environment.firebase.databaseURL}/Administrativo/IdTerNoPer.json?auth=${idToken}`;
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
    const options = { headers }
    const body = this.List.value;
    return this.http.put(url, body, options)
  }



  private buildForm(): void {
    this.form = this.formBuilder.group({
      noDuplicated: [null, Validators.requiredTrue],
      List: this.formBuilder.array([])
    })
  }

  private noRepeatKeys() {
    this.subs.push(this.form.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(res => {
        const list = res.List;
        
        if (list) {
          let isDuplicated: number = 0;
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list.length; j++) {
              
              if (list[i] == list[j]) isDuplicated++;
            }
          }
          if (isDuplicated > list.length) {
            this.message = `
          <div class="alert alert-warning" role="alert">
            No se admiten claves repetidas   
          </div>
          `
            return this.noDuplicated.patchValue(false)
          }
          this.message = '';
          return this.noDuplicated.patchValue(true)
        }
      }))
  }

  public addItem(value: string = null): void {
    this.List.push(this.formBuilder.control(value, Validators.required))
  }

  public removeItem(i: number): void {
    this.List.removeAt(i);
  }

  get List() { return this.form.get('List') as FormArray }
  get noDuplicated() { return this.form.get('noDuplicated') }

}
