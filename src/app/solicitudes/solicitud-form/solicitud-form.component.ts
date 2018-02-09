import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { DbService } from '../../services/db/db.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.css']
})
export class SolicitudFormComponent implements OnInit {

  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authProvider: AuthService,
    private http: HttpClient,
    private router: Router

  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.form = this.formBuilder.group({
      puntoInicio: ['', [Validators.required]],
      puntoFinal: ['', [Validators.required]],
      esPagoConTarjeta: [false, [Validators.required]],
      Nombres: ['', [Validators.required]],
      Apellidos: ['', [Validators.required]],
      Telefono: ['0', [Validators.required]],
      Celular: ['0', [Validators.required]],
      ValorDomicilio: [ 0, [Validators.required]],
      codigoCiudad: [11001, [Validators.required]],
      Descripcion: ['sin descripcion', [Validators.required]],
      DescripcionDomicilio: ['sin descripcion', [Validators.required]],
    })
  }

  onSubmit(){
    let data = this.form.value;
    data.user_id = this.authProvider.userState.uid;    
    const getToken = this.authProvider.userState.getToken()
    const newSolicitud = getToken.then(token => {
      data.idToken = token;
      //alert(data)
      return this.newSolicitud(data).toPromise();
    })
    const response = newSolicitud.then(response => {
      alert ('Servicio recibido exitosamente,' + ' '+ 'Codigo de la solicitud: '+ response.servicio_id + ' '+  ', El costo del servicio es de ' + response.servicio.TotalAPagar);
      //console.log(response)
      this.router.navigateByUrl("/dashboard/solicitud/lista");
    }).catch(err =>{
       alert(err);
    })
  }

  public newSolicitud(body){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    const url = 'https://us-central1-ptuvuelta.cloudfunctions.net/api/solicitudes'
    
    const _body = body;

    return this.http.post(url,_body, httpOptions)
  }

  get puntoInicio() { return this.form.get('puntoInicio')}
  get puntoFinal() { return this.form.get('puntoFinal')}
  get esPagoConTarjeta() { return this.form.get('esPagoConTarjeta')}
  get Nombres() { return this.form.get('Nombres')}
  get Apellidos() { return this.form.get('Apellidos')}
  get Telefono() { return this.form.get('Telefono')}
  get Celular() { return this.form.get('Celular')}
  get ValorDomicilio() { return this.form.get('ValorDomicilio')}
  get codigoCiudad() { return this.form.get('codigoCiudad')}
  get Descripcion() { return this.form.get('Descripcion')}
  get DescripcionDomicilio() { return this.form.get('DescripcionDomicilio')}
}
