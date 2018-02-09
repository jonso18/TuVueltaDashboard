import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth.service';
/* import { HttpClient, HttpHeaders } from '@angular/common/http'; */

@Injectable()
export class DbService {

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) { }

  public objectUserInfo(){
    const id = this.authService.userState.uid;
    return this.db.object("/Administrativo/Usuarios/"+id);
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

}
