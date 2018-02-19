import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db/db.service';
import { Subscription } from 'rxjs/Subscription';
import { IEstadoServicio } from '../../interfaces/estadoservicio.interface';

@Component({
  selector: 'app-estados-domicilios',
  templateUrl: './estados-domicilios.component.html',
  styleUrls: ['./estados-domicilios.component.css']
})
export class EstadosDomiciliosComponent implements OnInit {
  private sub: Subscription;
  public Estados: IEstadoServicio[];
  constructor(
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.loadInfo();
  }

  loadInfo(): void{
    this.sub = this.dbService.listEstadosServicioSnap().subscribe(res => {
      this.Estados = res;
    })
  }

}
