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
import { HttpClient } from '@angular/common/http';
import { IGlobalConfig } from '../../interfaces/config-global.interface';
import { IRol } from '../../interfaces/rol.interface';
import { IParamsRegistro } from '../../interfaces/params-registro.interface';
import { ITipoServicio } from '../../interfaces/tipo-servicio.interface';
import { environment } from '../../../environments/environment';
import { IEstadoUsuario } from '../../interfaces/estadousuario.interface';
@Injectable()
export class DbService {

  public Ciudades: ICiudad[];
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService,
    private http: HttpClient
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
          Prefijo: city.payload.val().Prefijo,
          Coordenadas: city.payload.val().Coordenadas
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

  listEstadosUsuario() {
    return this.db.list(`/Administrativo/EstadosUsuario`);
  }
  listEstadosUsuarioSnap(): Observable<IEstadoUsuario[]> {
    return this.listEstadosUsuario()
      .snapshotChanges()
      .map(changes =>
        changes.map(change => {
          const data = change.payload.val();
          const estado: IEstadoUsuario = {
            $key: change.payload.key,
            Nombre: data.Nombre,
            Descripcion: data.Descripcion
          };
          return estado;
        }))
  }

  public listTipoServicio() {
    return this.db.list(`/Administrativo/TipoServicio`)
  }

  public objectListaTiposServicio() {
    return this.db.object(`/Administrativo/ListaTipoServicios`)
  }

  public listListaTiposServicio() {
    return this.db.list(`/Administrativo/ListaTipoServicios`)
  }

  public objectTarifas(cityCode: number, serviceType: string) {
    return this.db.object(`/Administrativo/TipoServicio/${cityCode}/${serviceType}/Tarifas`)
  }

  public listSolicitudEnProceso() {
    return this.db.list(`/Operativo/Solicitud`, ref => ref.orderByChild('EnProceso').equalTo(true))
  }
  public listSolicitudFinalizadas() {
    return this.db.list(`/Operativo/Solicitud`, ref => ref.orderByChild('Estado').equalTo('Finalizado'))
  }

  public objectSolicitud(key: string) {
    return this.db.object(`/Operativo/Solicitud/${key}`)
  }

  public listLogSolicitud() {
    return this.db.list(`/Operativo/Logs/Solicitud`)
  }

  public listUsersByRol(Rol: string): Observable<IUser[]> {
    return this.db.list(`/Administrativo/Usuarios`, ref => ref.orderByChild('Rol').equalTo(Rol))
      .snapshotChanges().map(change => change.map(_user => {
        const user: IUser = this.formatUser(_user)
        return (user)
      }))
  }

  public objectTarifasCustom(cityCode: number, serviceType: string, userId: string) {
    return this.db.object(`Administrativo/Usuarios/${userId}/Tarifas/${cityCode}/${serviceType}`)
  }

  public objectConfigGlobal(): Observable<IGlobalConfig> {
    return this.db.object(`/Administrativo/ConfigGlobal`)
      .snapshotChanges()
      .distinctUntilChanged()
      .map(res => {
        return res.payload.val();
      })
  }

  public patchConfigGlobal(data: IGlobalConfig) {
    return this.http.patch(`${environment.firebase.databaseURL}/Administrativo/ConfigGlobal.json`, data);
  }

  /**
   * Get a formated list of Roles who are supported by TuVuelta system.
   * 
   * @returns Observable<IRol[]>
   */
  public listRol(): Observable<IRol[]> {
    return this.db.list(`/Administrativo/Roles`)
      .snapshotChanges()
      .map(changes =>
        changes.map(rol => {
          const data = rol.payload.val();
          const _rol: IRol = {
            $key: rol.payload.key,
            Nombre: data.Nombre,
            Descripcion: data.Descripcion ? data.Descripcion : null
          };
          return (_rol);
        }))
      .distinctUntilChanged()
  }

  /**
   * Get Register params for a user.
   * This is usually used with Mensajero rol
   * 
   * @returns Observable<IParamsRegistro>
   */
  public listParamsRegistro(): Observable<IParamsRegistro> {
    return this.db.list(`/Administrativo/ParamsRegistro`)
      .snapshotChanges()
      .map(changes => {
        let params: any = {};
        changes.forEach(item => {
          params[item.key] = item.payload.val();
        })
        const _params: IParamsRegistro = params
        return _params
      }
      )
      .distinctUntilChanged()
  }

  /**
   * Get a list of services types who provide TuVuelta.
   * This return a formated array according with ITipoServicio.
   * 
   * @returns Observable<ITipoServicio[]>
   */
  public listTiposServicio(): Observable<ITipoServicio[]> {
    return this.db.list(`/Administrativo/ListaTipoServicios`)
      .snapshotChanges()
      .map(changes =>
        changes.map(type => {
          const data = type.payload.val()
          let _type: ITipoServicio = {
            $key: type.payload.key,
            Nombre: data.Nombre
          };
          return (_type)
        }))
      .distinctUntilChanged()
  }

  /**
   * Look up in database for information of an specific user.
   * This will return null if user doesnt exist in database or
   * doesn't have information.
   * 
   * @param  {string} id Indentifier of user
   * @returns Observable<IUser | null>
   */
  objectUserInfoSnap(id: string): Observable<IUser | null> {
    return this.db.object(`/Administrativo/Usuarios/${id}`)
      .snapshotChanges()
      .map(user => {
        const data = user.payload.val();
        const _user: IUser | null = this.formatUser(user)
        return _user
      })
      .distinctUntilChanged()
  }

  /**
   * Return an entire list of users who are stored in the database.
   * But, doenst return list of users who are authenticated. Only in database.
   * This return a formated Array according with structure of IUser interface.
   * 
   * 
   * @returns Observable<IUser[]>
   */
  listUsers(): Observable<IUser[]> {
    return this.db.list(`/Administrativo/Usuarios`)
      .snapshotChanges()
      .map(changes =>
        changes.map(user => {
          const data = user.payload.val();
          const _user: IUser = this.formatUser(user)
          return _user
        }))
  }

  /**
   * This method will give the structure of a user format object.
   * So if some data doesnt' exisits this will complete it with null.
   * 
   * @param  {AngularFireAction<DataSnapshot>} dataSnapshot
   * @returns IUser
   */
  formatUser(dataSnapshot: AngularFireAction<DataSnapshot>): IUser | null {
    const data = dataSnapshot.payload.val()
    if (!data) return null
    return {
      $key: dataSnapshot.key,
      Apellidos: data.Apellidos ? data.Apellidos : null,
      Estado: data.Estado ? data.Estado : null,
      Rol: data.Rol ? data.Rol : null,
      Cedula: data.Cedula ? data.Cedula : null,
      Celular: data.Celular ? data.Celular : null,
      CelularFijo: data.CelularFijo ? data.CelularFijo : null,
      Ciudad: data.Ciudad ? data.Ciudad : null,
      ComoNosConocio: data.ComoNosConocio ? data.ComoNosConocio : null,
      Correo: data.Correo ? data.Correo : null,
      Direccion: data.Direccion ? data.Direccion : null,
      FechaNacimiento: data.FechaNacimiento ? data.FechaNacimiento : null,
      Nombres: data.Nombres ? data.Nombres : null,
      PlacaVehiculo: data.PlacaVehiculo ? data.PlacaVehiculo : null,
      TiempoDispParaHacerServicio: data.TiempoDispParaHacerServicio ? data.TiempoDispParaHacerServicio : null,
      TieneDatos: data.TieneDatos ? data.TieneDatos : null,
      TieneEPS: data.TieneEPS ? data.TieneEPS : null,
      TipoCelular: data.TipoCelular ? data.TipoCelular : null,
      TipoVehiculo: data.TipoVehiculo ? data.TipoVehiculo : null,
      Tarifas: data.Tarifas ? data.Tarifas : null,
      ClienteIntegracion: data.ClienteIntegracion ? data.ClienteIntegracion : null
    }
  }
}
