import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISeguimientoActivos } from '../../../interfaces/seguimiento-activos.interface';
import { DbService } from '../../../services/db/db.service';
import { ICiudad } from '../../../interfaces/ciudad.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seguimiento-activos',
  templateUrl: './seguimiento-activos.component.html',
  styleUrls: ['./seguimiento-activos.component.css']
})
export class SeguimientoActivosComponent implements OnInit, OnDestroy {

  public Activos$: Observable<ISeguimientoActivos[]>
  public Ciudades: ICiudad[];
  public selectedCity: ICiudad;
  private sub: Subscription;
  constructor(
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.Activos$ = this.dbService.listSeguimientoActivos();
    this.sub =  this.dbService.listCiudades().subscribe(cities => {
      this.Ciudades = cities;
      this.selectedCity = cities[0]
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

}
