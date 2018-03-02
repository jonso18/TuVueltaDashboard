import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IUser } from '../../interfaces/usuario.interface';
import { ESTADOS_SERVICIO } from '../../config/EstadosServicio';
import { DbService } from '../../services/db/db.service';
import { MessagesService } from '../../services/messages/messages.service';
import { dataConfirmation } from '../../config/dialogs.data';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-comprar-servicio',
  templateUrl: './comprar-servicio.component.html',
  styleUrls: ['./comprar-servicio.component.css']
})
export class ComprarServicioComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public groupTiempo: FormGroup
  @Input() Mensajeros: IUser[];
  @Input() Id: string;
  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private messageService: MessagesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy() {
    console.log("Destroying compra servicio")
  }

  buildForm(): void { 
    this.form = this.formBuilder.group({
      Fecha: [null],
      Minutos: [null],
      Hora: [null],
      Mensajero: [null, [Validators.required]]
    })
  }

  public onDateValid(event): void {
    console.log(event);
    this.form.patchValue(event)
  }

  public getErrorMessage(Control: FormControl) {
    return this.messageService.getErrorMessage(Control)
  }

  public onSubmit(): void {
    const isValid: boolean = this.form.valid;
    if (isValid) {
      const data = this.form.value;
      const fecha: Date = new Date(data.Fecha);
      const dateObj: Date = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), data.Hora, data.Minutos);
      const date: string = dateObj.getTime().toString();
      const _key: string = this.Id;
      const currentUserId: string = this.authService.userState.uid;
      const _uid: string = data.Mensajero;
      const now: string = new Date().getTime().toString()
      const nameMensajero: string = this.Mensajeros.filter(mensajero => {
        if (mensajero.$key == _uid) return mensajero;
      }).map(mensajero => mensajero.Nombres + ' ' + mensajero.Apellidos)[0];
      const title: string = `<strong>Realizar</strong> Compra`;
      const question: string = `Desea Realizar compra del servicio <strong>${this.Id}</strong> para el Mensajero <strong>${nameMensajero}</strong> con Fecha  <strong>${ 'Dia: '+fecha.getDate()+' Mes: '+(fecha.getMonth() + 1 )+' Año: '+fecha.getFullYear()+ ' a las '+ data.Hora +':'+ data.Minutos}</strong>`;
      let dialogRef = this.dialog.open(ConfirmationComponent,
        dataConfirmation(title, question));
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.dbService.objectSolicitud(_key)
            .update({
              Estado: ESTADOS_SERVICIO.EnProceso,
              Motorratoner_id: _uid,
              EnProceso: true,
              fechaCompra: Number(date)
            })
            .then(res => {
              return this.dbService.objectLogDateSolicitud(_key, date).update({
                Estado: ESTADOS_SERVICIO.EnProceso,
                Motorratoner_id: _uid
              })
            })
            .then(()=> {
              return this.dbService.objectLogCompraServicio(currentUserId, now).update({
                servicio_id: _key,
                Motorratoner_id: _uid
              })
            })
            .then(res => {
              this.snackBar.open('Compra Exitosa', 'Ok', {
                verticalPosition: 'top',
                duration: 3000
              })
            })
            .catch(err => {
              console.log(err);
            })
        }
      })
    }
  }
  get Fecha() { return this.form.get('Fecha'); }
  get Minutos() { return this.form.get('Minutos'); }
  get Hora() { return this.form.get('Hora'); }
  get Mensajero() { return this.form.get('Mensajero'); }
}
