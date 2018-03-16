import { Component, OnInit, Input, Inject } from '@angular/core';
import { ICiudad } from '../../../interfaces/ciudad.interface';
import { DbService } from '../../../services/db/db.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher, MatSnackBar } from '@angular/material';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';


@Component({
  selector: 'app-ciudades',
  templateUrl: './ciudades.component.html',
  styleUrls: ['./ciudades.component.css']
})
export class CiudadesComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  private subCiudades: Subscription;
  public Ciudades: ICiudad[];
  public subs: Subscription[] = [];
  constructor(
    public dbService: DbService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadCiudades();
  }

  ngOnDestroy() {
    this.subCiudades.unsubscribe();
    this.subs.forEach(sub => sub.unsubscribe())
  }

  loadCiudades() {
    this.subCiudades = this.dbService.listCiudades()
      .subscribe(res => {
        this.form = this.formBuilder.group({
          Citys: this.formBuilder.array([])
        })
        this.Ciudades = res;
        res.forEach(item => {
          this.addCity(item)
        })
      })
  }

  addCity(city) {
    
    this.Citys.push(this.formBuilder.group({
      Codigo: [city.Codigo],
      Nombre: [city.Nombre, Validators.required],
      Prefijo: [city.Prefijo, Validators.required]
    }))
  }

  update(city: ICiudad) {
    console.log(city)
    const key = city.Codigo;
    const data: ICiudad = city;
    delete data.Codigo;
    const p = this.dbService.objectCiudad(key).update(data)
    p.then((res) => {
      console.log(res);
      this.snackBar.open("Ciudad Actualizada", 'Ok', {
        duration: 3000,
        verticalPosition: 'top',
      })
    })
  }

  delete(city: ICiudad) {

    const key = city.Codigo;
    let dialogRef = this.dialog.open(DialogDeleteCity, {
      width: '250px',
      data: { action: this.dbService.objectCiudad(key) }
    });

    this.subs.push(dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.snackBar.open("Ciudad Eliminada", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    }))
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogNewCity, {
      width: '250px'
    });

    this.subs.push(dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open("Ciudad Creada", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    }));
  }

  get Citys() { return this.form.get('Citys') as FormArray }

}

@Component({
  selector: 'dialog-DialogNewCity',
  template: `
  <div class="text-center">Nueva Ciudad</div>
  <form [formGroup]="form">
    <mat-form-field>
      <input matInput placeholder="Codigo" formControlName="Codigo">
      <mat-error *ngIf="!Codigo.hasError('required') && Codigo.hasError('pattern')">
      Codigo es <strong>Numerico</strong>
      </mat-error>
      <mat-error *ngIf="Codigo.hasError('required')">
      Codigo es <strong>Obligatorio</strong>
      </mat-error>
    </mat-form-field>
  <mat-form-field>
    <input matInput placeholder="Nombre" formControlName="Nombre">
    <mat-error *ngIf="Nombre.hasError('required')">
    Nombre es <strong>Obligatorio</strong>
      </mat-error>
  </mat-form-field>
    <mat-form-field>
      <input matInput placeholder="Prefijo" formControlName="Prefijo">
      <mat-error *ngIf="Prefijo.hasError('required')">
      Prefijo es <strong>Obligatorio</strong>
      </mat-error>
    </mat-form-field>
  </form>
  <button mat-button (click)="onNoClick()">Cancelar</button>
  <button mat-button color="primary" (click)="save()" [disabled]="form.invalid">Guardar</button>
  `,
})
export class DialogNewCity implements OnInit {
  public form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogNewCity>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dbService: DbService
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      Codigo: ['', [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      Nombre: ['', [Validators.required]],
      Prefijo: ['', [Validators.required]]
    })
  }

  save() {
    let data: ICiudad = this.form.value;
    const key = data.Codigo;
    delete data.Codigo;
    let p_city: Promise<any> = this.dbService.objectCiudad(key).update(data);
    p_city.then(res => {
      console.log(res)
      this.dialogRef.close(true);

    })
  }

  get Codigo() { return this.form.get('Codigo') }
  get Nombre() { return this.form.get('Nombre') }
  get Prefijo() { return this.form.get('Prefijo') }
}


@Component({
  selector: 'dialog-DialogNewCity',
  template: `
  <div class="text-center">¿Confirma Eliminación?</div>
  <button mat-button (click)="onNoClick()">Cancelar</button>
  <button mat-button color="primary" (click)="save()" >Guardar</button>
  `,
})
export class DialogDeleteCity {
  public form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogNewCity>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dbService: DbService
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }


  save() {
    const p = this.data.action.remove()
    p.then(res => {
      this.dialogRef.close(true);
    })
  }

}