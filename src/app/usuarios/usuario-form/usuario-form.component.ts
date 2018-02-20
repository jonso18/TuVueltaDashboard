import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  form: FormGroup
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.buildForm();
  }

  buildForm(){
    this.form = this.formBuilder.group({
      Nombres: [null, [Validators.required]],
      Apellidos: [null, [Validators.required]],
      Cedula: [null, [Validators.required]],
      Celular: [null, [Validators.required]],
      Ciudad: [null, [Validators.required]],
      Correo: [null, [Validators.required]],
      Rol: [null, [Validators.required]]
    })
  }

}
