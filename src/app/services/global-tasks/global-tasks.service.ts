import { Injectable } from '@angular/core';
import { DbService } from '../db/db.service';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAction, AngularFireDatabase } from 'angularfire2/database';
import { DataSnapshot } from '@firebase/database-types';
import { ESTADOS_SERVICIO } from '../../config/EstadosServicio';
import { AuthService } from '../auth/auth.service';
import { ESTADOS_USUARIO } from '../../config/EstadosUsuario';

@Injectable()
export class GlobalTasksService {
  private intrvlSrvcEnSitio;
  private intervalServicesEnSitio;
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  public stopTasks(): void {
    if (this.intervalServicesEnSitio) clearInterval(this.intervalServicesEnSitio)
  }

  public startTasks(): void {
    /* setInterval(() => {
      this.servicesEnSitio();
    }, 30000) */
  }

  private servicesEnSitio(): void {
    const user = this.authService.userInfo;
    if (user && user.Estado == ESTADOS_USUARIO.Activo) {

      const threeDays: number = 259200000;
      const oneDay: number = 86400000;
      const now: number = new Date().getTime();
      const startAt: string = (now - oneDay).toString();
      this.db.list(`/Operativo/Logs/Solicitud`,
        ref => ref.orderByKey().startAt(startAt))
        .snapshotChanges()
        .map(
          changes =>
            changes.map(log => {
              const data = log.payload.val();
              const _logsServicio: ILogServicio[] = Object.keys(data)
                .map(logKey => {
                  const _log: ILogServicio = {
                    logKey: logKey,
                    service_id: log.payload.key,
                    Estado: data[logKey].Estado,
                    Motorratoner_id: data[logKey].Motorratoner_id
                  }
                  return _log
                });
              return _logsServicio
            })
        )
        .first()
        .do(console.log)
        .subscribe((res: Array<ILogServicio[]>) => {
          res.forEach(service => {
            if (service[service.length - 1].Estado == ESTADOS_SERVICIO.EnSitio) {
              const _service: ILogServicio = service[service.length - 1];
              const now: number = new Date().getTime();
              const fiveMinutes: number = 300000;
              if ((now > Number(_service.logKey) + fiveMinutes)) {
                const msg: string = `El Servicio ${_service.service_id} tiene mas de 5 Minutos en el estado en Sitio`;
                const title: string = `Más de 5 minutos En Sitio`;
                this.toastr.warning(msg, title, {
                  tapToDismiss: false
                })
              }
            }
          })
        })
    }
  }
}


export interface ILogServicio {
  service_id: string;
  logKey: string;
  Estado: string;
  Motorratoner_id: string;
}