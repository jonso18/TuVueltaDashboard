import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DbService } from '../../../services/db/db.service';
import { Subscription } from 'rxjs/Subscription';
import { IGanancias } from '../../../interfaces/gananciass.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ganancias',
  templateUrl: './ganancias.component.html',
  styleUrls: ['./ganancias.component.css']
})
export class GananciasComponent implements OnInit {
  
  private sub: Subscription;
  public form: FormGroup
  constructor(
    private dbService: DbService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) { }
  
  ngOnInit() {
    this.loadGanancias();
  }

  loadGanancias(){
    this.sub = this.getGanancias().subscribe(response => {
      const data = response;
      data.Mensajero*=100;
      data.MensajeroMensajeria*=100;
      this.buildForm();
      this.form.patchValue(data);
    })
  }

  getGanancias(): Observable<IGanancias>{
    return this.dbService.objectGanancias().snapshotChanges().map(item => {
      const Ganancias: IGanancias = item.payload.val()
      return Ganancias;
    })
  }

  buildForm(){
    this.form = this.formBuilder.group({
      Mensajero: [null, [
        Validators.required, 
        Validators.min(0), 
        Validators.max(100),
        Validators.pattern('^(0|[1-9][0-9]*)$')
      ]],
      MensajeroMensajeria: [null, [
        Validators.required, 
        Validators.min(0), 
        Validators.max(100),
        Validators.pattern('^(0|[1-9][0-9]*)$')
      ]]
    });
  }

  save(){
    const data: IGanancias = this.form.value;
    data.Mensajero/=100;
    data.MensajeroMensajeria/=100;
    const p = this.dbService.objectGanancias().update(data);
    p.then(res => {
      this.snackBar.open("Información Actualizada", 'Ok', {
        duration: 3000,
        verticalPosition: 'top',
      })
    })
  }

  get Mensajero() { return this.form.get('Mensajero'); }
  get MensajeroMensajeria() { return this.form.get('MensajeroMensajeria'); }

}
