import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DbService } from '../../../services/db/db.service';
import { MatTableDataSource, MatPaginator, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { ROLES } from '../../../config/Roles';
import { DialogDeleteCity } from '../../../parametros/ciudades/ciudades.component';

@Component({
  selector: 'app-reasignacion',
  templateUrl: './reasignacion.component.html',
  styleUrls: ['./reasignacion.component.css']
})
export class ReasignacionComponent implements OnInit {
  public Mensajeros;
  resultsLength = 0;
  displayedColumns = ['Id','Fecha', 'TotalAPagar', 'Telefono', 'PagoConTarjeta', 'Distancia', 'puntoInicio', 'puntoFinal', 'Estado', 'Mensajero', 'MensajeroCelular', 'Actions'];
  public dataSource: MatTableDataSource<any>;
  public solicitudes;
  public Clientes;
  public allSolicitudes;
  @ViewChild('paginator') paginator: MatPaginator;
  constructor(
    private dbService: DbService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadInfo();
  }

  private loadInfo() {
    this.loadMensajeros();
    this.loadClients();
    this.loadSolicitudEnProceso();
  }

  loadClients(){
    const rol = ROLES.Cliente
    this.dbService.listUsersByRol(rol).subscribe(res => {
      this.Clientes = res;
    })
  }

  loadMensajeros() {
    this.dbService.listMensajeros().snapshotChanges().subscribe(res => {
      this.Mensajeros = res.reduce((o, val) => {
        o[val.key] = val.payload.val();
        return o;
      }, {});
    })
  }

  sortByClient(client){
    if (!client){
      this.solicitudes = this.allSolicitudes;
      this.instanceTable();
      return
    }
    
    this.solicitudes = this.allSolicitudes.filter(item => {
      if (item.payload.val().user_id == client.$key){
        return item
      }
    })
    
    this.instanceTable();
    

  }

  loadSolicitudEnProceso() {
    this.dbService.listSolicitudEnProceso().snapshotChanges().subscribe(res => {
      this.solicitudes = this.allSolicitudes = res;
      this.instanceTable();
    })
  }



  instanceTable() {
    this.dataSource = new MatTableDataSource<any>(this.solicitudes)
    this.dataSource.paginator = this.paginator;

    this.dataSource.paginator.pageSizeOptions = [5, 10, 20];
    this.resultsLength = this.solicitudes.length;
  }

  openDialogDelete(element){
    console.log(element)
    const key = element.key;
    let dialogRef = this.dialog.open(DialogDeleteCity, {
      width: '250px',
      data: { action: this.dbService.objectSolicitud(key) }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.snackBar.open("Solicitud Eliminada", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  openDialog(serviceId, fechaCompra, PrevioMotorratoner_id) {
    const _serviceId = serviceId;
    const _fechaCompra = fechaCompra;
    const _PrevioMotorratoner_id = PrevioMotorratoner_id;
    let dialogRef = this.dialog.open(DialogReasignacion, {
      width: '250px',
      data: { PrevioMotorratoner_id: _PrevioMotorratoner_id, fechaCompra: _fechaCompra, serviceId: _serviceId, Mensajeros: this.Mensajeros }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.snackBar.open("Proceso Exitoso", 'Ok', {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }
}


@Component({
  selector: 'dialog-DialogReasignacion',
  template: `
  <mat-select placeholder="Seleccione Mensajero" [(ngModel)]="mensajeroSelected" *ngIf="Mensajeros">
  <ng-container *ngFor="let row of Mensajeros">
    <mat-option  [value]="row.key" *ngIf="row.key != prev">
      {{ row.Nombres }} {{ row.Apellidos }}
    </mat-option>
  </ng-container>
  </mat-select>
  <div class="text-center">
  <button mat-button (click)="onNoClick()">Cancelar</button>
  <button mat-button [disabled]="mensajeroSelected == null" color="primary" (click)="save()" >Guardar</button>
  </div>
  `,
})
export class DialogReasignacion implements OnInit {
  public form: FormGroup;
  public mensajeroSelected = null;
  public prev
  constructor(
    public dialogRef: MatDialogRef<DialogReasignacion>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dbService: DbService
    
  ) { }
  public Mensajeros;
  ngOnInit() {
    this.prev = this.data.PrevioMotorratoner_id;

    let Mensajeros = this.data.Mensajeros
    this.Mensajeros = Object.keys(Mensajeros).map(key => {
      console.log(key)
      return {
        key: key,
        Nombres: Mensajeros[key].Nombres,
        Apellidos: Mensajeros[key].Apellidos
      }
    })

  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }


  save() {
    console.log(this.data)
    const { fechaCompra, serviceId, PrevioMotorratoner_id } = this.data
    const Motorratoner_id = this.mensajeroSelected;
    const NuevaFechaCompra = new Date().getTime();
    
    const body = {
      Reasignando: true,
      PrevioMotorratoner_id: PrevioMotorratoner_id,
      Motorratoner_id: Motorratoner_id,
      fechaCompra: fechaCompra,
      NuevaFechaCompra: NuevaFechaCompra,
    }

    const p = this.dbService.objectSolicitud(serviceId).update(body)
    p.then(res => {
      this.dialogRef.close(true);
    })
  }

}