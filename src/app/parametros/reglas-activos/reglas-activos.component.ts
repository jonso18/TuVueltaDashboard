import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DbService } from '../../services/db/db.service';
import { IRegasActivos } from '../../interfaces/reglasactivos.interface';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reglas-activos',
  templateUrl: './reglas-activos.component.html',
  styleUrls: ['./reglas-activos.component.css']
})
export class ReglasActivosComponent implements OnInit {
  private sub: Subscription;
  public form: FormGroup;
  private rulesData = [null, [
    Validators.required,
    Validators.min(0),
    Validators.pattern('^(0|[1-9][0-9]*)$')
  ]]
  constructor(
    private dbSerice: DbService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadInfo();
  }
  /**
   * Load all information to work on this component
   * @returns void
   */
  loadInfo(): void {
    this.sub = this.dbSerice.objectReglasActivosSnap()
      .subscribe((res: IRegasActivos) => {
        const data: IRegasActivos = res;
        this.buildForm();
        this.form.patchValue(data);
      })
  }

  /**
   * Load form structure
   * @returns void
   */
  buildForm(): void {
    this.form = this.formBuilder.group({
      TiempoActualizarPosicion: this.rulesData,
      RazonDeCambio: this.formBuilder.group({
        Distancia: this.rulesData,
        Tiempo: this.rulesData
      })
    })
  }
  /**
   * check if form is valid and call update function;
   * @returns void
   */
  onSubmit(): void {
    const valid: boolean = this.form.valid;
    if (valid) {
      this.update();
    }
  }

  /**
   * Update Reglas Activos on firebase
   * @returns void
   */
  update(): void {
    const data: IRegasActivos = this.form.value;
    const info: IRegasActivos = {
      TiempoActualizarPosicion: Number(data.TiempoActualizarPosicion),
      RazonDeCambio:{
        Tiempo: Number(data.RazonDeCambio.Tiempo),
        Distancia: Number(data.RazonDeCambio.Distancia)
      }
    }
    const p = this.dbSerice.objectReglasActivos().update(info)
    p.then(res => {
      this.snackBar.open("Información Actualizada", 'Ok', {
        duration: 3000,
        verticalPosition: 'top',
      })
    })
  }

  get TiempoActualizarPosicion() { return this.form.get('TiempoActualizarPosicion') }
  get RazonDeCambio() { return this.form.get('RazonDeCambio') }
  get Tiempo() { return this.RazonDeCambio.get('Tiempo') }
  get Distancia() { return this.RazonDeCambio.get('Distancia') }


}
