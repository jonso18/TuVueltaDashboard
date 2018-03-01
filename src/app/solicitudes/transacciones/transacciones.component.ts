import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { ISolicitud } from '../../interfaces/solicitud.interface';
import { DbService } from '../../services/db/db.service';
import { IUser } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css']
})
export class TransaccionesComponent implements OnInit {
  public Id$: Observable<string>;
  public Data$: Observable<(ISolicitud | IUser | any)[]>

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
  }

  public getUser(id): Observable<IUser> {
    return this.dbService.objectUserInfoSnap(id)
  }

}
