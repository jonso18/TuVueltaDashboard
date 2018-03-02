import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { ISolicitud } from '../../interfaces/solicitud.interface';
import { DbService } from '../../services/db/db.service';
import { IUser } from '../../interfaces/usuario.interface';
import { ROLES } from '../../config/Roles';
import { IEstadoServicio } from '../../interfaces/estadoservicio.interface';
import { ESTADOS_SERVICIO } from '../../config/EstadosServicio';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css']
})
export class TransaccionesComponent implements OnInit {
  public Id$: Observable<string>;
  public Data$: Observable<(ISolicitud | IUser | any)[]>;
  public Mensajeros$: Observable<IUser[]>;
  public EstadosServicio$: Observable<IEstadoServicio[]>;
  public ESTADOS_SERVICIO = ESTADOS_SERVICIO;
  constructor(
    private route: ActivatedRoute,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.Id$ = this.route.params.map((params: string[]) => params['id']);
    this.Data$ = this.Id$
      .switchMap(id =>
        this.dbService.objectSolicitudSnap(id))
      .switchMap(Solicitud =>
        this.getUser(Solicitud.user_id), (Solicitud, User) => [Solicitud, User])
      .switchMap((data: (ISolicitud | IUser | any)[]) =>
        this.getUser(data[0].Motorratoner_id), (data, Mensajero) =>
          [data[0], data[1], Mensajero])
    this.Mensajeros$ = this.dbService.listUsersByRol(ROLES.Mensajero);
    this.EstadosServicio$ = this.dbService.listEstadosServicioSnap();
  }

  public getUser(id): Observable<IUser> {
    return this.dbService.objectUserInfoSnap(id)
  }

}
