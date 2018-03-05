import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs';

@Injectable()
export class AuthService {

  public userInfo: any;
  public userState;

  public subUserInfo: Subscription;
  constructor(
    private authService: AngularFireAuth
  ) { }


  public authState() {
    return this.authService.authState;
  }

  public logout() {
    this.subUserInfo.unsubscribe();
    return this.authService.auth.signOut()
  }

  /**
   * test
   */
  public test() {
    return this.authService.idToken
  }

  public createUser(email:string, password:string): Promise<any>{
    return this.authService.app.auth().createUserAndRetrieveDataWithEmailAndPassword(email,password)
    /* return this.authService.auth.app.auth().createUserWithEmailAndPassword(email,password) */
    /* return this.authService.auth.createUserAndRetrieveDataWithEmailAndPassword(email,password) */
    /* return this.authService.auth.createUserWithEmailAndPassword(email,password) */
  }
}
