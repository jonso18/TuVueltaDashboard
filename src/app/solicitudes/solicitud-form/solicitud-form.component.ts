import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { DbService } from '../../services/db/db.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ICiudad } from '../../interfaces/ciudad.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-solicitud-dialog',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.css']
})
export class SolicitudFormDialog implements OnInit {

  form: FormGroup;
  public Ciudades: ICiudad[];
  public isUpdating: boolean;
  public solicitud;
  constructor(
    private formBuilder: FormBuilder,
    private authProvider: AuthService,
    private http: HttpClient,
    private router: Router,
    private dbService: DbService,
    public dialogRef: MatDialogRef<SolicitudFormDialog>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    const isUpdating = this.isUpdating = this.data.update
    if (!isUpdating){
      this.loadCitys();
    }
    this.buildForm();
    
    console.log(this.data)
  }

  loadCitys(){
    this.dbService.listCiudades().subscribe(res => {
      this.Ciudades = res;
    })
  }

  buildForm() {
    this.form = this.formBuilder.group({
      puntoInicio: ['', [Validators.required]],
      puntoFinal: ['', [Validators.required]],
      esPagoConTarjeta: [false, [Validators.required]],
      Nombres: ['No Especificado', [Validators.required]],
      Apellidos: ['No Especificado', [Validators.required]],
      Telefono: ['0', [Validators.required]],
      Celular: ['0', [Validators.required]],
      ValorDomicilio: [0, [Validators.required]],
      codigoCiudad: [11001, [Validators.required]],
      Descripcion: ['sin descripcion', [Validators.required]],
      DescripcionDomicilio: ['sin descripcion', [Validators.required]],
      EsCotizacion: [false]
    })

    if (this.isUpdating){
      const data = this.solicitud = this.data.snap.payload.val();
      this.form.patchValue(data)
      console.log(data.puntoInicio)
      console.log(data)
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.doRequest();
    }
  }

  doRequest() {
    let data = this.form.value;
    data.user_id = this.isUpdating ? this.solicitud.user_id : this.authProvider.userState.uid;
    data.EsActualizacion = this.isUpdating ? true: false;
    data.servicioId = this.isUpdating ? this.data.snap.payload.key : null;
    console.log(data)
    const getToken = this.authProvider.userState.getIdToken()
    const newSolicitud = getToken.then(token => {
      data.idToken = token;
      console.log(token)
      //alert(data)
      return this.newSolicitud(data).toPromise();
    })
    const response = newSolicitud.then(response => {
      // alert('Servicio recibido exitosamente,' + ' ' + 'Codigo de la solicitud: ' + response.servicio_id + ' ' + ', El costo del servicio es de ' + response.servicio.TotalAPagar);
      //console.log(response)
      this.router.navigateByUrl("/dashboard/solicitud/lista");
      console.log(response);
      
      if (this.isUpdating){
        this.dialogRef.close(response);
      }
    }).catch(err => {
      if (this.isUpdating){
        this.dialogRef.close(err);
      }
      console.log(err)
    })
  }

  public newSolicitud(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    /* const url = 'https://us-central1-ptuvuelta.cloudfunctions.net/api/solicitudes' */
    const url = 'https://us-central1-tuvueltap.cloudfunctions.net/api/solicitudes';

    const _body = body;

    return this.http.post(url, _body, httpOptions)
  }

  get puntoInicio() { return this.form.get('puntoInicio') }
  get puntoFinal() { return this.form.get('puntoFinal') }
  get esPagoConTarjeta() { return this.form.get('esPagoConTarjeta') }
  get Nombres() { return this.form.get('Nombres') }
  get Apellidos() { return this.form.get('Apellidos') }
  get Telefono() { return this.form.get('Telefono') }
  get Celular() { return this.form.get('Celular') }
  get ValorDomicilio() { return this.form.get('ValorDomicilio') }
  get codigoCiudad() { return this.form.get('codigoCiudad') }
  get Descripcion() { return this.form.get('Descripcion') }
  get DescripcionDomicilio() { return this.form.get('DescripcionDomicilio') }
  get EsCotizacion() { return this.form.get('EsCotizacion') }
}




@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.css']
})
export class SolicitudFormComponent implements OnInit {

  form: FormGroup;
  public Ciudades: ICiudad[];
  
  public solicitud;
  constructor(
    private formBuilder: FormBuilder,
    private authProvider: AuthService,
    private http: HttpClient,
    private router: Router,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.loadCitys();
    this.buildForm();
  }

  loadCitys(){
    this.dbService.listCiudades().subscribe(res => {
      this.Ciudades = res;
    })
  }

  buildForm() {
    this.form = this.formBuilder.group({
      puntoInicio: ['', [Validators.required]],
      puntoFinal: ['', [Validators.required]],
      esPagoConTarjeta: [false, [Validators.required]],
      Nombres: ['No Especificado', [Validators.required]],
      Apellidos: ['No Especificado', [Validators.required]],
      Telefono: ['0', [Validators.required]],
      Celular: ['0', [Validators.required]],
      ValorDomicilio: [0, [Validators.required]],
      codigoCiudad: [11001, [Validators.required]],
      Descripcion: ['sin descripcion', [Validators.required]],
      DescripcionDomicilio: ['sin descripcion', [Validators.required]],
      EsCotizacion: [false]
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.doRequest();
    }
  }

  doRequest() {
    let data = this.form.value;
    data.user_id = this.authProvider.userState.uid;
    console.log(data)
    const getToken = this.authProvider.userState.getIdToken()
    const newSolicitud = getToken.then(token => {
      data.idToken = token;
      console.log(token)
      //alert(data)
      return this.newSolicitud(data).toPromise();
    })
    const response = newSolicitud.then(response => {
      // alert('Servicio recibido exitosamente,' + ' ' + 'Codigo de la solicitud: ' + response.servicio_id + ' ' + ', El costo del servicio es de ' + response.servicio.TotalAPagar);
      //console.log(response)
      this.router.navigateByUrl("/dashboard/solicitud/lista");
      console.log(response);
      
    }).catch(err => {
      console.log(err)
    })
  }

  public newSolicitud(body) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    /* const url = 'https://us-central1-ptuvuelta.cloudfunctions.net/api/solicitudes' */
    const url = 'https://us-central1-tuvueltap.cloudfunctions.net/api/solicitudes';

    const _body = body;

    return this.http.post(url, _body, httpOptions)
  }

  get puntoInicio() { return this.form.get('puntoInicio') }
  get puntoFinal() { return this.form.get('puntoFinal') }
  get esPagoConTarjeta() { return this.form.get('esPagoConTarjeta') }
  get Nombres() { return this.form.get('Nombres') }
  get Apellidos() { return this.form.get('Apellidos') }
  get Telefono() { return this.form.get('Telefono') }
  get Celular() { return this.form.get('Celular') }
  get ValorDomicilio() { return this.form.get('ValorDomicilio') }
  get codigoCiudad() { return this.form.get('codigoCiudad') }
  get Descripcion() { return this.form.get('Descripcion') }
  get DescripcionDomicilio() { return this.form.get('DescripcionDomicilio') }
  get EsCotizacion() { return this.form.get('EsCotizacion') }
}
