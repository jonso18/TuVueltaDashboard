import { Component, OnInit, ViewChild } from '@angular/core';
import { DbService } from '../../services/db/db.service';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Solicitud } from '../../interfaces/solicitud.interface';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ROLES } from '../../config/Roles';
import { SolicitudFormComponent } from '../solicitud-form/solicitud-form.component';

@Component({
  selector: 'app-solicitud-list',
  templateUrl: './solicitud-list.component.html',
  styleUrls: ['./solicitud-list.component.css']
})
export class SolicitudListComponent implements OnInit {

  public displayedColumns = ['Fecha', 'Nombres', 'Apellidos', 'Celular', 'TotalAPagar', 'Telefono', 'PagoConTarjeta', 'Distancia', 'puntoInicio', 'puntoFinal', 'Estado', 'Mensajero', 'PlacaVehiculo', 'MensajeroCelular'];

  public dataSource: MatTableDataSource<any>;
  public ROLES;
  resultsLength = 0;

  public solicitudes;
  public Mensajeros;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(
    public dbService: DbService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  ngAfterViewInit() {

  }

  _new() {
    this.router.navigateByUrl('/dashboard/solicitud/nueva')
  }

  ngOnInit() {
    this.ROLES = ROLES;
    this.loadInfo();
  }

  loadInfo() {

    this.loadMensajeros();
    const Rol = this.authService.userInfo.Rol
    if ( Rol == ROLES.Cliente){
      this.loadSolicitudes();
    }else if (Rol == ROLES.Administrador){
      this.displayedColumns.push("Acciones");
      this.loadAllSolicitudes()
    }
    
  }

  loadSolicitudes() {
    this.dbService.listSolicitudes().subscribe(res => {
      this.solicitudes = res;
      this.instanceTable();
    })
  }

  loadAllSolicitudes(){
    
    this.dbService.listAllSolicitudes().subscribe(res => {
      this.solicitudes = res;
      this.instanceTable();
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

  sortData(event) {
    console.log(event)
    switch (event.active) {
      case 'key':
        this.sortByDirection('key', event.direction)
        break;

      default:
        break;
    }
  }

  openDialogUpdate(element){
    console.log(element)
    let dialogRef = this.dialog.open(SolicitudFormComponent, {
      width: '600px',
      data: { update:true, snap: element  }
    });
  }

  instanceTable() {
    this.dataSource = new MatTableDataSource<any>(this.solicitudes)
    this.dataSource.paginator = this.paginator;

    this.dataSource.paginator.pageSizeOptions = [5, 10, 20];
    this.resultsLength = this.solicitudes.length;
  }

  sortByDirection(key, direction) {

    switch (direction) {
      case 'asc':
        console.log("sorting by key asc")
        this.solicitudes = this.solicitudes.sort((a, b) => {
          return a.key - b.key
        })
        this.instanceTable();
        break;
      case 'desc':
        console.log("sorting by key desc")
        this.solicitudes = this.solicitudes.sort((a, b) => {
          return b.key - a.key
        })
        this.instanceTable();
        break;

      default:
        break;
    }
  }

}


