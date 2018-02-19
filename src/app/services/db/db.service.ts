import { IGanancias } from './../../interfaces/gananciass.interface';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth.service';
/* import { HttpClient, HttpHeaders } from '@angular/common/http'; */
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAction, AngularFireObject, AngularFireList } from 'angularfire2/database/interfaces';
import { DataSnapshot } from '@firebase/database-types';
import { ICiudad } from '../../interfaces/ciudad.interface';
import { IEquipamiento } from '../../interfaces/equipamiento.interface';
import { IRegasActivos } from '../../interfaces/reglasactivos.interface';
import { IEstadoServicio } from '../../interfaces/estadoservicio.interface';
import { IUser } from '../../interfaces/usuario.interface';
@Injectable()
export class DbService {
  public Ciudades: ICiudad[];
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) { }

  public objectUserInfo() {
    const id = this.authService.userState.uid;
    return this.db.object("/Administrativo/Usuarios/" + id);
  }

  /* public newSolicitud(body){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    const url = 'https://us-central1-tuvueltap.cloudfunctions.net/api/solicitudes'
    const _body = body;

    return this.http.post(url,_body, httpOptions)
  } */

  public listSolicitudes() {
    const id: string = this.authService.userState.uid;
    return this.db.list("/Operativo/Solicitud/", ref => ref.orderByChild('user_id').equalTo(id)).snapshotChanges();
  }

  public listAllSolicitudes() {
    const id: string = this.authService.userState.uid;
    return this.db.list("/Operativo/Solicitud/").snapshotChanges();
  }

  public listMensajeros() {
    return this.db.list("/Administrativo/Usuarios", ref => ref.orderByChild('Rol').equalTo('Mensajero'));
  }

  public listCiudades(): Observable<ICiudad[]> {
    return this.db.list("/Administrativo/ParamsRegistro/Ciudades")
      .snapshotChanges().map(changes => {
        return changes.map(city => ({
          Codigo: city.payload.key,
          Nombre: city.payload.val().Nombre,
          Prefijo: city.payload.val().Prefijo
        }))
      });
  }

  public objectEquipamiento(): AngularFireObject<IEquipamiento> {
    return this.db.object(`/Administrativo/Equipamiento`)

  }

  public objectCiudad(codigo) {
    const key = codigo;
    return this.db.object(`/Administrativo/ParamsRegistro/Ciudades/${key}`)
  }

  public objectGanancias(): AngularFireObject<IGanancias> {
    return this.db.object(`/Administrativo/Ganancias`)
  }

  public objectReglasActivos(): AngularFireObject<IRegasActivos> {
    return this.db.object(`/Administrativo/ReglasActivos`)
  }

  public objectReglasActivosSnap(): Observable<IRegasActivos> {
    return this.objectReglasActivos()
      .snapshotChanges()
      .map(snap => {
        const data: IRegasActivos = snap.payload.val()
        return data
      })
  }

  public listEstadosServicio(): AngularFireList<IEstadoServicio> {
    return this.db.list(`/Administrativo/EstadosServicio`)
  }

  public listEstadosServicioSnap(): Observable<IEstadoServicio[]> {
    return this.listEstadosServicio().snapshotChanges()
      .map(changes => changes.map(estado => {
        const value = estado.payload.val();
        const data: IEstadoServicio = {
          $key: estado.payload.key,
          Nombre: value.Nombre,
          Descripcion: value.Descripcion
        };
        return data;
      }))
  }

  public listTipoServicio(){
    return this.db.list(`/Administrativo/TipoServicio`)
  }

  public objectListaTiposServicio(){
    return this.db.object(`/Administrativo/ListaTipoServicios`)
  }
  
  public listListaTiposServicio(){
    return this.db.list(`/Administrativo/ListaTipoServicios`)
  }

  public objectTarifas(cityCode: number, serviceType: string){
    return this.db.object(`/Administrativo/TipoServicio/${cityCode}/${serviceType}/Tarifas`)
  }

  public listSolicitudEnProceso(){
    return this.db.list(`/Operativo/Solicitud`, ref => ref.orderByChild('EnProceso').equalTo(true))
  }
  public listSolicitudFinalizadas(){
    return this.db.list(`/Operativo/Solicitud`, ref => ref.orderByChild('Estado').equalTo('Finalizado'))
  }

  public objectSolicitud(key: string){
    return this.db.object(`/Operativo/Solicitud/${key}`)
  }

  public listLogSolicitud(){
    return this.db.list(`/Operativo/Logs/Solicitud`)
  }
  
  public listUsersByRol(Rol: string): Observable<IUser[]>{
    return this.db.list(`/Administrativo/Usuarios`, ref => ref.orderByChild('Rol').equalTo(Rol))
    .snapshotChanges().map(change => change.map(_user => {
      const data = _user.payload.val();
      const user: IUser = {
        $key: _user.payload.key,
        Apellidos: data.Apellidos? data.Apellidos : null,
        Estado: data.Estado? data.Estado : null,
        Rol: data.Rol? data.Rol : null,
        Cedula: data.Cedula? data.Cedula : null,
        Celular: data.Celular? data.Celular : null,
        CelularFijo: data.CelularFijo? data.CelularFijo : null,
        Ciudad: data.Ciudad? data.Ciudad : null,
        ComoNosConocio: data.ComoNosConocio? data.ComoNosConocio : null,
        Correo: data.Correo? data.Correo : null,
        Direccion: data.Direccion? data.Direccion : null,
        FechaNacimiento: data.FechaNacimiento? data.FechaNacimiento : null,
        Nombres: data.Nombres? data.Nombres : null,
        PlacaVehiculo: data.PlacaVehiculo? data.PlacaVehiculo : null,
        TiempoDispParaHacerServicio: data.TiempoDispParaHacerServicio? data.TiempoDispParaHacerServicio : null,
        TieneDatos: data.TieneDatos? data.TieneDatos : null,
        TieneEPS: data.TieneEPS? data.TieneEPS : null,
        TipoCelular: data.TipoCelular? data.TipoCelular : null,
        TipoVehiculo: data.TipoVehiculo? data.TipoVehiculo : null,
      }
      return (user)
    }))
  }
}
