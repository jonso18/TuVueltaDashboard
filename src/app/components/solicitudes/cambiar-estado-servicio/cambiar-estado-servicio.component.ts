import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IEstadoServicio } from '../../../interfaces/estadoservicio.interface';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DbService } from '../../../services/db/db.service';
import { MessagesService } from '../../../services/messages/messages.service';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { ConfirmationComponent } from '../../../dialogs/confirmation/confirmation.component';
import { dataConfirmation } from '../../../config/dialogs.data';
import { ISolicitud } from '../../../interfaces/solicitud.interface';
import { ESTADOS_SERVICIO } from '../../../config/EstadosServicio';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { ROLES } from '../../../config/Roles';

@Component({
  selector: 'app-cambiar-estado-servicio',
  templateUrl: './cambiar-estado-servicio.component.html',
  styleUrls: ['./cambiar-estado-servicio.component.css']
})
export class CambiarEstadoServicioComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public ESTADOS_SERVICIO = ESTADOS_SERVICIO;
  public LogEstadosSolicitud;
  private Mensajeros;
  private dataSource: MatTableDataSource<any>;
  displayedColumns = ['$key', 'Estado', 'Motorratoner_id'];
  
  @Input() Id: string;
  @Input() Estados: IEstadoServicio[];
  @Input() Solicitud: ISolicitud;

  private subs: Subscription[] = [];
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
    this.dataSource = new MatTableDataSource([]);
    this.subs.push(this.loadMensajeros());
    this.subs.push(this.loadLogSolicitud());
  }

  ngOnDestroy() {
    console.log("Destroying compra servicio")
    this.subs.forEach(res => res.unsubscribe());
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      Fecha: [null],
      Minutos: [null],
      Hora: [null],
      Estado: [null, [Validators.required]]
    })
  }

  public onDateValid(event): void {
    this.form.patchValue(event)
  }

  public getErrorMessage(Control: FormControl) {
    return this.messageService.getErrorMessage(Control)
  }

  onSubmit() {
    const isValid: boolean = this.form.valid;
    if (isValid) {
      const data = this.form.value;
      const fecha: Date = new Date(data.Fecha);
      const dateObj: Date = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), data.Hora, data.Minutos);
      const date: string = dateObj.getTime().toString();
      const _key: string = this.Id;
      const _uid: string = data.Estado;
      const nameEstado: string = this.Estados.filter(Estado => {
        if (Estado.$key == _uid) return Estado;
      }).map(Estado => Estado.Nombre)[0];
      const title: string = `<strong>Cambiar</strong> Estado`;
      const question: string = `Desea Realizar el cambio de Estado <strong>${this.Solicitud.Estado}</strong> del servicio <strong>${this.Id}</strong> para el Estado <strong>${nameEstado}</strong> con Fecha  <strong>${'Dia: ' + fecha.getDate() + ' Mes: ' + (fecha.getMonth() + 1) + ' Año: ' + fecha.getFullYear() + ' a las ' + data.Hora + ':' + data.Minutos}</strong>`;
      let dialogRef = this.dialog.open(ConfirmationComponent,
        dataConfirmation(title, question));
      this.subs.push(dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.updateSolicitudEstado(date);
        }
      }))
    }
  }

  updateSolicitudEstado(date) {
    const isFinalizado: boolean = this.Estado.value == ESTADOS_SERVICIO.Finalizado;
    const state: string = this.Estado.value;
    const key = this.Id;
    const _uid = this.Solicitud.Motorratoner_id;
    const UsuarioEnAdmin: string = this.authService.userState.uid;
    /* const date = new Date().getTime() */
    this.dbService.objectSolicitud(key).update({
      Estado: state,
      EnProceso: !isFinalizado
    }).then(res => {
      return this.dbService.objectLogDateSolicitud(key, date.toString()).update({
        Estado: state,
        Motorratoner_id: _uid,
        EsCompradoPorAdmin: true,
        UsuarioEnAdmin: UsuarioEnAdmin
      })
    }).then(res => {
      if (isFinalizado) {
        const data = this.Solicitud;
        let GananciaMensajero = data.GananciaMensajero
        let BonoRelanzamiento = data.BonoRelanzamiento;
        if (BonoRelanzamiento) {
          GananciaMensajero += BonoRelanzamiento
        }
        const Retefuente = Number(GananciaMensajero) * 0.04;
        GananciaMensajero -= Retefuente;
        return this.dbService
          .objectLogCreditoRetiroMensajero(_uid, date.toString())
          .update({
            servicio_id: key,
            Retefuente: Retefuente,
            GananciaMensajero: GananciaMensajero
          })
      }
      return Promise.resolve(null)
    }).then(res => {
      this.snackBar.open('Cambio de Estado Exitoso', 'Ok', {
        verticalPosition: 'top',
        duration: 3000
      })
    })
  }

  private loadLogSolicitud(): Subscription {
    const key: string = this.Solicitud.$key;
    return this.dbService.objectLogSolicitud(key)
      .valueChanges()
      
      .subscribe(res => {
        
        const data = Object.keys(res).map(key => {
          let data = res[key]
          data.$key = key
          return data
        });
        this.LogEstadosSolicitud = data.sort((a, b) => b - a);
        
        this.dataSource.data = this.LogEstadosSolicitud;
      })
  }

  private loadMensajeros(): Subscription {
    return this.dbService.listUsersByRol(ROLES.Mensajero)
      .subscribe(res => {
        const data = res.reduce((o, val) => {
          o[val.$key] = val;
          return o;
        },{})
        this.Mensajeros = data;
        console.log(this.Mensajeros);
      })
  }

  get Fecha() { return this.form.get('Fecha'); }
  get Minutos() { return this.form.get('Minutos'); }
  get Hora() { return this.form.get('Hora'); }
  get Estado() { return this.form.get('Estado'); }
}
