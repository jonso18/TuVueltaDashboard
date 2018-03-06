import { Component, OnInit, ViewChild } from '@angular/core';
import { DbService } from '../../../services/db/db.service';
import { MatPaginator, MatTableDataSource, MatDialog, MatDatepickerInputEvent, MatSnackBar, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
/* import { Solicitud } from '../../interfaces/solicitud.interface'; */
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ROLES } from '../../../config/Roles';
import { SolicitudFormDialog } from '../solicitud-form/solicitud-form.component';
import { DialogDeleteCity } from '../../parametros/ciudades/ciudades.component';
import { ILogCreditoRetiroMensajero } from '../../../interfaces/creditoretiro-mensajero.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DialogReasignacion } from '../reasignaciones/reasignacion/reasignacion.component';
import { FormBuilder, FormControl } from '@angular/forms';
import { MessagesService } from '../../../services/messages/messages.service';
import { ConfirmationComponent } from '../../../dialogs/confirmation/confirmation.component';
import { dataConfirmation } from '../../../config/dialogs.data';

@Component({
  selector: 'app-solicitud-list',
  templateUrl: './solicitud-list.component.html',
  styleUrls: ['./solicitud-list.component.css']
})
export class SolicitudListComponent implements OnInit {

  dateEnd: number;
  dateStart: number;
  public displayedColumns = ['Id', 'Fecha', 'TotalAPagar', 'PagoConTarjeta', 'Distancia', 'puntoInicio', 'puntoFinal', 'Estado', 'Mensajero', 'MensajeroCelular'];
  public Clientes;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public ROLES;
  resultsLength = 0;
  public allSolicitudes;
  public solicitudes;
  public Mensajeros = {};
  public clientSelected;
  public inputFilter: FormControl;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public dbService: DbService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private messages: MessagesService
  ) { }


  loadClients() {
    const rol = ROLES.Cliente
    this.dbService.listUsersByRol(rol).subscribe(res => {
      this.Clientes = res;
    })
  }

  ngOnInit() {
    this.ROLES = ROLES;
    this.loadInfo();
    this.loadFilter();
  }

  loadInfo() {
    this.loadClients();
    this.loadMensajeros();
    const Rol = this.authService.userInfo.Rol
    if (Rol == ROLES.Cliente) {
      this.loadSolicitudes();
    } else if (Rol == ROLES.Administrador || Rol == ROLES.Operador) {
      this.displayedColumns.push("Acciones");
      this.loadAllSolicitudes()
    }

  }

  loadSolicitudes() {
    this.dbService.listSolicitudes().subscribe(res => {
      this.solicitudes = this.allSolicitudes = res.sort((a, b) => Number(b.key) - Number(a.key));
      this.instanceTable();
    });
  }

  loadAllSolicitudes() {
    this.dbService.listAllSolicitudes()
      .subscribe(res => {
        this.solicitudes = this.allSolicitudes = res.sort((a, b) => Number(b.key) - Number(a.key));
        this.instanceTable();
      })
  }

  applyFilter(): void {
    if (!this.clientSelected) {
      this.solicitudes = this.allSolicitudes;
    } else {
      this.solicitudes = this.allSolicitudes.filter(item => {
        if (item.payload.val().user_id === this.clientSelected.$key) {
          return item;
        }
      })
    }

    if (this.dateStart) {
      this.solicitudes = this.solicitudes.filter(item => {
        if (item.key > this.dateStart) {
          return item;
        }
      })
    }

    if (this.dateEnd) {
      this.solicitudes = this.solicitudes.filter(item => {
        if (item.key < this.dateEnd) {
          return item;
        }
      })
    }

    this.instanceTable();
  }

  pickerStart(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateStart = new Date(event.value).getTime();
    this.applyFilter();
  }

  pickerEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    this.dateEnd = new Date(event.value).getTime();
    this.applyFilter();
  }

  loadMensajeros() {
    this.dbService.listMensajeros().snapshotChanges().subscribe(res => {

      this.Mensajeros = res.reduce((o, val) => {
        o[val.key] = val.payload.val();
        return o;
      }, {});

    })
  }

  removeCreditosRetiro(element) {
    const key = element.key;
    const Motorratoner_id: string = element.payload.val().Motorratoner_id;
    if (Motorratoner_id) {
      this.dbService.listLogCreditoRetiroMensajeroByServicioId(Motorratoner_id, key)
        .subscribe((logs: ILogCreditoRetiroMensajero[]): void => {
          const p_delete = logs.map(_log => {
            return this.dbService
              .objectLogCreditoRetiroMensajero(Motorratoner_id, _log.$key)
              .remove()
          });
          Promise.all(p_delete).then(res => {
            this.notifySolicitudEliminada();
          }).catch(err => {
            console.log("Error eliminando los log de credito de retiro. ", err)
          })

        })
    } else {
      this.notifySolicitudEliminada();
    }
  }

  /**
   * Remove al movements for the specified element.
   * 
   * @private
   * @param {any} element 
   * @memberof SolicitudListComponent
   */
  private removeLogsSolicitud(element): void {
    const key: string = element.key;
    this.dbService.objectLogSolicitud(key).remove();
  }

  /**
   * Create and instance from a dialog to confirm delete action.
   * 
   * @param {any} element 
   * @public
   * @memberof SolicitudListComponent
   */
  public openDialogDelete(element): void {
    const key = element.key;
    const title: string = `Eliminar Servicio`;
    const question: string = `Desea Eliminar el servicio ${key}`;
    let dialogRef = this.dialog.open(ConfirmationComponent,
      dataConfirmation(title, question));

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dbService.objectSolicitud(key)
          .remove()
          .then(res => {
            this.removeCreditosRetiro(element);
            this.removeLogsSolicitud(element);
          })

      }
    })
  }

  /**
   * Create an instance to do a assign a new Mensajero to the 
   * specifyied schedule.
   * 
   * @param {any} serviceId 
   * @param {any} fechaCompra 
   * @param {any} PrevioMotorratoner_id 
   * @public
   * @memberof SolicitudListComponent
   */
  public openDialogReAsigancion(serviceId, fechaCompra, PrevioMotorratoner_id): void {
    const _serviceId = serviceId;
    const _fechaCompra = fechaCompra;
    const _PrevioMotorratoner_id = PrevioMotorratoner_id;
    const dialogRef = this.dialog.open(DialogReasignacion, {
      width: '350px',
      data: { PrevioMotorratoner_id: _PrevioMotorratoner_id, fechaCompra: _fechaCompra, serviceId: _serviceId, Mensajeros: this.Mensajeros }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.snackBar.open("Proceso Exitoso", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  }

  /**
   * Create an snap to notify in the DOM solicitud has been delted.
   * 
   * @private
   * @memberof SolicitudListComponent
   */
  private notifySolicitudEliminada(): void {
    this.snackBar.open("Solicitud Eliminada", 'Ok', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  /**
   * Create a intance from a dialog to update solicitud
   * 
   * @param {any} element 
   * @public
   * @memberof SolicitudListComponent
   */
  public openDialogUpdate(element): void {
    this.dialog.open(SolicitudFormDialog, {
      width: '600px',
      data: { update: true, snap: element }
    });
  }

  /**
   * Prepare data, paginator, sort and rest lenght to show
   * in the DOM.
   * 
   * @private
   * @memberof SolicitudListComponent
   */
  private instanceTable(): void {
    this.dataSource.data = this.solicitudes;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.pageSizeOptions = [5, 10, 20];
    this.resultsLength = this.solicitudes.length;
  }

  /**
   * Load table filter which search in every value.
   * 
   * @private
   * @returns {any} 
   * @memberof SolicitudListComponent
   */
  private loadFilter(): any {
    this.inputFilter = this.formBuilder.control(null);

    this.inputFilter.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((val: string) => {
        this.dataSource.filter = val.trim().toLowerCase();
      });
  }

}


