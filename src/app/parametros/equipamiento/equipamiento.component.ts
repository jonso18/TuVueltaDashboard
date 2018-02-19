import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { DbService } from '../../services/db/db.service';
import { IEquipamiento, IRequisitoEquip } from '../../interfaces/equipamiento.interface';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-equipamiento',
  templateUrl: './equipamiento.component.html',
  styleUrls: ['./equipamiento.component.css']
})
export class EquipamientoComponent implements OnInit {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {

    this.loadEquipamient();
  }

  loadEquipamient() {
    this.dbService.objectEquipamiento().snapshotChanges()
      .map(equipamient => {
        const _equipament: IEquipamiento = {
          Mensaje: equipamient.payload.val().Mensaje,
          MontoParaTrabajarHoy: equipamient.payload.val().MontoParaTrabajarHoy,
          Requisitos: equipamient.payload.val().Requisitos
        };
        return (_equipament);
      }).subscribe((response: IEquipamiento) => {
        this.buildForm(response);
        this.form.patchValue(response)
      })
  }

  buildForm(data: IEquipamiento) {
    this.form = this.formBuilder.group({
      Mensaje: [null, [Validators.required]],
      MontoParaTrabajarHoy: [null, [
        Validators.required,
        Validators.pattern('^(0|[1-9][0-9]*)$')
      ]],
      Requisitos: this.formBuilder.group({
        ChaquetaMensajero: this.formGroupRequisito(data.Requisitos.ChaquetaMensajero),
        EquipoMensajero: this.formGroupRequisito(data.Requisitos.EquipoMensajero),
        EquipoMoto: this.formGroupRequisito(data.Requisitos.EquipoMoto)
      })
    });
  }

  formGroupRequisito(requisito: IRequisitoEquip): FormGroup {
    return this.formBuilder.group({
      Etiqueta: [null, [Validators.required]],
      Opciones: this.formBuilder.array(
        requisito.Opciones
          .map(i => this.addControlOption(i))
      )
    })
  }

  addControlOption(i=null):FormControl {
    return this.formBuilder.control(i, Validators.required)
  }

  addOpcion(requisito: string) {
    this.getOpciones(requisito).push(this.addControlOption())
  }

  deleteControlOption(requisito, i){
    this.getOpciones(requisito).removeAt(i)
  }

  getOpciones(requisito: string): FormArray{
    return this.form.get('Requisitos').get(requisito).get('Opciones') as FormArray;
  }

  onSubmit(){
    if (this.form.valid){
      this.save();
      
    }
  }
  async save(){
    try {
      const data = this.form.value;
      const saved = await this.dbService.objectEquipamiento().update(data)
      this.snackBar.open("Información Actualizada", 'Ok', {
        duration: 3000,
        verticalPosition: 'top',
      })
    } catch (error) {
      console.log(error)
    }
  }

}
