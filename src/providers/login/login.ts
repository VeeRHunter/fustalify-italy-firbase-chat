import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingProvider } from '../loading/loading';

import * as firebase from 'firebase';
import { AlertProvider } from '../alert/alert';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { ConnectUserPage } from '../../pages/connect-user/connect-user';
import { FirebaseProvider } from '../firebase/firebase';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  public navCtrl: NavController;

  constructor(public loadingProvider: LoadingProvider,
    public http: HttpClient,
    public alertProvider: AlertProvider,
    public firebaseProvider: FirebaseProvider,
  ) {
    console.log('Hello LoginProvider Provider');
  }


  setNavController(navCtrl) {
    this.navCtrl = navCtrl;
  }

  emailLogin(email, password) {
    this.loadingProvider.show();
    firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {
      this.loadingProvider.hide();
      console.log('success');
      this.saveCurrentUser(email, password);
      this.firebaseProvider.setOnlineState();
      this.navCtrl.setRoot(ConnectUserPage);
    }, error => {
      this.loadingProvider.hide();
      console.log('failed');
      this.alertProvider.showErrorMessage(error["code"]);
    });
  }

  saveCurrentUser(email, password) {
    const userInfo = { "email": email, "password": password };
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
  }

  getCurrentLoggedUser() {
    if (localStorage.getItem("currentUser") === null || localStorage.getItem("currentUser") === ""
      || typeof (localStorage.getItem("currentUser")) === "undefined") {
      return "";
    } else {
      return JSON.parse(localStorage.getItem("currentUser"));
    }
  }

  sendPasswordReset(email) {
    console.log(email);
    if (email != null || email != undefined || email != "") {
      this.loadingProvider.show();
      firebase.auth().sendPasswordResetEmail(email).then((success) => {
        this.loadingProvider.hide();
        this.alertProvider.showPasswordResetMessage(email);
      }).catch((error) => {
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage(error["code"]);
      });
    }
  }

}
