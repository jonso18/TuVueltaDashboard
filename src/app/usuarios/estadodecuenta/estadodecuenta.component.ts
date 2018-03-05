import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IRelanzamiento } from '../../interfaces/relanzamiento.interface';
import { Observable } from 'rxjs/Observable';
import { DbService } from '../../services/db/db.service';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../../interfaces/usuario.interface';
import { MatTabGroup } from '@angular/material';
import { IRetiros } from '../../interfaces/retiros.interface';
import { ILogEquipamiento } from '../../interfaces/logequipamiento.interface';

@Component({
  selector: 'app-estadodecuenta',
  templateUrl: './estadodecuenta.component.html',
  styleUrls: ['./estadodecuenta.component.css']
})
export class EstadodecuentaComponent implements OnInit {
  public Id$: Observable<string>;
  public Relanzamientos$: Observable<IRelanzamiento[]>;
  public User$: Observable<IUser>;
  public Retiros$: Observable<IRetiros[]>;
  public LogEquipamiento$: Observable<ILogEquipamiento[]>

  @ViewChild('tabRelanzamiento') tabs ;
  constructor(
    private dbService: DbService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.Id$ = this.route.params.map((params: string[]) => params['id']);
    this.Relanzamientos$ = this.Id$.switchMap(_id => this.dbService.listRelanzamientos(_id));
    this.User$ = this.Id$.switchMap(_id => this.dbService.objectUserInfoSnap(_id));
    this.Retiros$ = this.Id$.switchMap(_id => this.dbService.listRetiros(_id))
    this.LogEquipamiento$ = this.Id$.switchMap(_id => this.dbService.listLogEquipamiento(_id))
  }


}
