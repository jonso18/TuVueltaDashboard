import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../../interfaces/usuario.interface';
import { DbService } from '../../services/db/db.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit, OnDestroy {

  @ViewChild('paginator') paginator: MatPaginator;
  public dataSource: MatTableDataSource<IUser> = new MatTableDataSource();
  public displayedColumns = ['Id',
    'Nombres', 'Apellidos', 'Estado',
    'Cedula', 'Celular', 'CelularFijo', 'Ciudad',
    'Correo', 'TipoVehiculo', 'PlacaVehiculo', 'Rol',
    'Acciones'];
  private sub: Subscription;
  public resultsLength: number = 0;
  public Usuarios: IUser[];
  constructor(
    private dbService: DbService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  loadData(): void {

    this.sub = this.dbService.listUsers()
      .subscribe((res: IUser[]) => {
        console.log("Inicializando data source")
        this.Usuarios = res;
        this.instanceTable();
      });


  }

  onUpdate(user: IUser){
    this.router.navigateByUrl(`/dashboard/Usuarios/${user.$key}`)
    
  }

  instanceTable(): void {
    this.dataSource = new MatTableDataSource<any>(this.Usuarios)
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.pageSizeOptions = [5, 10, 20];
    this.resultsLength = this.Usuarios.length;
  }

}
