import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-solicitud-form',
  templateUrl: './solicitud-form.component.html',
  styleUrls: ['./solicitud-form.component.css']
})
export class SolicitudFormComponent implements OnInit {

  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.form = this.formBuilder.group({
      puntoInicio: [null, [Validators.required]],
	    puntoFinal: [null, [Validators.required]],
	    esPagoConTarjeta: [null, [Validators.required]],
	    Nombres: [null, [Validators.required]],
	    Apellidos: [null, [Validators.required]],
	    Telefono: [null, [Validators.required]],
	    Celular: [null, [Validators.required]],
	    ValorDomicilio: [null, [Validators.required]],
	    codigoCiudad: [null, [Validators.required]],
	    Descripcion: [null, [Validators.required]],
	    DescripcionDomicilio: [null, [Validators.required]],
    })
  }
}
