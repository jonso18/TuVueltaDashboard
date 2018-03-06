import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISeguimientoActivos } from '../../../interfaces/seguimiento-activos.interface';
import { DbService } from '../../../services/db/db.service';
import { ICiudad } from '../../../interfaces/ciudad.interface';

@Component({
  selector: 'app-seguimiento-activos',
  templateUrl: './seguimiento-activos.component.html',
  styleUrls: ['./seguimiento-activos.component.css']
})
export class SeguimientoActivosComponent implements OnInit {

  public Activos$: Observable<ISeguimientoActivos[]>
  public Ciudades$: Observable<ICiudad[]>
  public selectedCity: ICiudad;
  constructor(
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.Activos$ = this.dbService.listSeguimientoActivos();
    this.Ciudades$ = this.dbService.listCiudades()
  }

}
