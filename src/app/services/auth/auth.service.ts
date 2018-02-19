import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {

  public userInfo: any;
  public userState;
  constructor(
    private authService: AngularFireAuth
  ) { }


  public authState() {
    return this.authService.authState;
  }

  public logout() {
    return this.authService.auth.signOut()
  }
  /**
   * test
   */
  public test() {
    return this.authService.idToken
  }
}
