import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DbService } from '../../services/db/db.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent implements OnInit {

  private subTipoServicio: Subscription;
  private subListaTiposServicio: Subscription;
  private subCiudades: Subscription;

  public form: FormGroup;
  public Ciudades;
  public TiposServicio;
  public ListaTiposServicio;
  public citySelected = null;
  public serviceTypeSelected = null;
  public cityCodeSelected = null;
  
  constructor(
    private dbService: DbService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadInfo();

  }

  loadInfo() {
    this.loadTipoServicio();
    this.loadCitys();
    this.loadListaTiposServicio();
  }

  loadTipoServicio() {
    this.subTipoServicio = this.dbService.listTipoServicio().snapshotChanges().subscribe(res => {
      this.TiposServicio = res;
      console.log("Tipos Servicio")
      console.log(this.TiposServicio)
      this.citySelected = false;
      this.serviceTypeSelected = false;
      this.cityCodeSelected = null;
    })
  }

  loadListaTiposServicio() {
    this.subListaTiposServicio = this.dbService.listListaTiposServicio()
      .snapshotChanges().subscribe(res => {
        this.ListaTiposServicio = res
        console.log("Lista tipos servicio")
        console.log(this.ListaTiposServicio)
      })
  }

  loadCitys() {
    this.subCiudades = this.dbService.listCiudades().subscribe(res => {
      this.Ciudades = res.reduce((o, val) => {
        o[val.Codigo] = val;
        return o;
      });
      console.log("Lista Ciudades")
      console.log(this.Ciudades)
    })
  }

  buildForm() {
    const data = this.citySelected[this.serviceTypeSelected].Tarifas;
    console.log(data)
    this.form = this.formBuilder.group({
      Tarifa1: this.tarifaempty(data.Tarifa1),
      Tarifa2: this.tarifaempty(data.Tarifa2),
      Tarifa3: this.tarifaempty(data.Tarifa3),
    })
    

  }

  

  tarifaempty(tarifa): FormGroup {

    const control: FormGroup = this.formBuilder.group({
      maxKm: [tarifa.maxKm, [Validators.required]],
      minKm: [tarifa.minKm, [Validators.required]],
      value: [tarifa.value, [Validators.required]]
    })
    return control
  }

  tarifaValidators(tarifaprev: string, tarifapost: string): ValidatorFn[] {

    const validators: ValidatorFn[] = [];
    validators.push(Validators.min(tarifaprev ? this.getminKm(tarifaprev).value : 0))
    if (tarifapost) {
      console.log(this.getminKm(tarifapost).value)
      validators.push(Validators.max(this.getmaxKm(tarifapost).value))
    }
    console.log(validators)
    return validators
  }

  onSubmit() {
    if (this.form.valid) {
      this.update();
    }
  }

  update() {
    let data = this.form.value;
    data.Tarifa1.minKm = Number(data.Tarifa1.minKm)
    data.Tarifa1.value = Number(data.Tarifa1.value)
    data.Tarifa1.maxKm = data.Tarifa2.minKm - 0.1;
    data.Tarifa2.minKm = Number(data.Tarifa2.minKm)
    data.Tarifa2.value = Number(data.Tarifa2.value)
    data.Tarifa2.maxKm = data.Tarifa3.minKm - 0.1;
    data.Tarifa3.minKm = Number(data.Tarifa3.minKm)
    data.Tarifa3.value = Number(data.Tarifa3.value)
    const cityCode: number = this.cityCodeSelected;
    const serviceType: string = this.serviceTypeSelected;
    const p = this.dbService.objectTarifas(cityCode, serviceType).update(data)
    p.then(res => {
      this.snackBar.open("Información Actualizada", 'Ok', {
        duration: 3000,
        verticalPosition: 'top',
      })
    })
  }

  getmaxKm(tarifa: string) { return this.form.get(tarifa).get('maxKm') }
  getminKm(tarifa: string) { return this.form.get(tarifa).get('minKm') }

}
