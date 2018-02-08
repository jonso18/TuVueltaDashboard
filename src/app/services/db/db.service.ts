import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../auth/auth.service';

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

}
