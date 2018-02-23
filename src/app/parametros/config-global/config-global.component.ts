import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IGlobalConfig } from '../../interfaces/config-global.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-config-global',
  templateUrl: './config-global.component.html',
  styleUrls: ['./config-global.component.css']
})
export class ConfigGlobalComponent implements OnInit {

  public form: FormGroup;
  constructor(
    private dbService: DbService,
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    
    this.loadInfo();
  }

  loadInfo(){
    this.dbService.objectConfigGlobal().subscribe((res:IGlobalConfig) => {
      this.buildForm();
      this.form.patchValue(res);
    })
  }

  buildForm() {
    this.form = this.formBuilder.group({
      CantSrvcQuePuedeComprarMensajero: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      DistanciaActivarBotonEstadoSrvc: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      TiempoCambiarAInactivo: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
      TiempoIntervaloRevisarUltimoCambioEstado: [null, [Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')]],
    })
  }

  onSubmit(){
    const isValid: boolean = this.form.valid;
    if (isValid){
      this.update();
    }
  }

  update(){
    
    const formData: IGlobalConfig = this.form.value;
    const data: IGlobalConfig = {
      CantSrvcQuePuedeComprarMensajero: Number(formData.CantSrvcQuePuedeComprarMensajero),
      DistanciaActivarBotonEstadoSrvc: Number(formData.DistanciaActivarBotonEstadoSrvc),
      TiempoIntervaloRevisarUltimoCambioEstado: Number(formData.TiempoIntervaloRevisarUltimoCambioEstado),
      TiempoCambiarAInactivo: Number(formData.TiempoCambiarAInactivo)
    };
    this.http.patch(`${environment.firebase.databaseURL}/Administrativo/ConfigGlobal.json`, data).toPromise().then(res => {
      console.log(res)
    })
  }

get CantSrvcQuePuedeComprarMensajero() { return this.form.get('CantSrvcQuePuedeComprarMensajero')}
get DistanciaActivarBotonEstadoSrvc() { return this.form.get('DistanciaActivarBotonEstadoSrvc')}
get TiempoCambiarAInactivo() { return this.form.get('TiempoCambiarAInactivo')}
get TiempoIntervaloRevisarUltimoCambioEstado() { return this.form.get('TiempoIntervaloRevisarUltimoCambioEstado')}

}
