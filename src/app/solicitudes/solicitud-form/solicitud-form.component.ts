import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { DbService } from '../../services/db/db.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
    private http: HttpClient

  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.form = this.formBuilder.group({
      puntoInicio: ['universidad del tolima', [Validators.required]],
      puntoFinal: ['universidad de ibague, ibague tolima', [Validators.required]],
      esPagoConTarjeta: [false, [Validators.required]],
      Nombres: ['Ronaldo Pruebas', [Validators.required]],
      Apellidos: ['Ronaldo', [Validators.required]],
      Telefono: ['12123123', [Validators.required]],
      Celular: ['351351', [Validators.required]],
      ValorDomicilio: [20000, [Validators.required]],
      codigoCiudad: [73001, [Validators.required]],
      Descripcion: ['asdf', [Validators.required]],
      DescripcionDomicilio: ['asdf', [Validators.required]],
    })
  }

  onSubmit(){
    let data = this.form.value;
    data.user_id = this.authProvider.userState.uid;    
    const getToken = this.authProvider.userState.getToken()
    const newSolicitud = getToken.then(token => {
      data.idToken = token;
      console.log(data)
      return this.newSolicitud(data).toPromise();
    })
    const response = newSolicitud.then(response => {
      console.log("Exitoso")
      console.log(response)
    })
    
    
  }

  public newSolicitud(body){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    const url = 'https://us-central1-tuvueltap.cloudfunctions.net/api/solicitudes'
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
