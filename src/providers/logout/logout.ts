import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import * as firebase from 'firebase';
import { LoadingProvider } from '../loading/loading';
import { DataProvider } from '../data/data';
import { SigninPage } from '../../pages/signin/signin';
import { FirebaseProvider } from '../firebase/firebase';

/*
  Generated class for the LogoutProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LogoutProvider {

  constructor(public app: App,
    public loadingProvider: LoadingProvider,
  ) {
    console.log("Initializing Logout Provider");

  }

  // Hooks the app to this provider, this is needed to clear the navigation views when logging out.
  setApp(app) {
    this.app = app;
  }

  // Logs the user out on Firebase, and clear navigation stacks.
  // It's important to call setApp(app) on the constructor of the controller that calls this function.
  logout() {
    this.loadingProvider.show();
    // Sign the user out on Firebase
    firebase.auth().signOut().then((success) => {
      // Clear navigation stacks
      this.app.getRootNav().popToRoot().then(() => {
        this.loadingProvider.hide();
        localStorage.setItem("currentUser", "");
        this.app.getRootNav().setRoot(SigninPage);
      });
    });
  }

}
