import { IGanancias } from './../../interfaces/gananciass.interface';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth.service';
/* import { HttpClient, HttpHeaders } from '@angular/common/http'; */
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AngularFireAction, AngularFireObject } from 'angularfire2/database/interfaces';
import { DataSnapshot } from '@firebase/database-types';
import { ICiudad } from '../../interfaces/ciudad.interface';
import { IEquipamiento } from '../../interfaces/equipamiento.interface';
import { IRegasActivos } from '../../interfaces/reglasactivos.interface';
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
}
