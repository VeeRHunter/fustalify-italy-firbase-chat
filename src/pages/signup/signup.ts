import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert } from 'ionic-angular';
import { FormControl, Validators } from '@angular/forms';
import { LoadingProvider } from '../../providers/loading/loading';

import * as firebase from 'firebase';
import { AlertProvider } from '../../providers/alert/alert';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {


  img = "./assets/imgs/default-dp.png";

  public emailFormControl = new FormControl('', [
    Validators.email,
    Validators.required
  ]);

  public passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  public fullnameFormControl = new FormControl('', [
    Validators.required
  ]);

  public usernameFormControl = new FormControl('', [
    Validators.required
  ]);

  public phoneFormControl = new FormControl('', [
    Validators.required
  ]);

  public userData = { "fullname": "", "username": "", "email": "", "password": "", "phone": "" };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register(signupUser) {
    if (signupUser.valid) {
      this.loadingProvider.show();
      firebase.auth().createUserWithEmailAndPassword(this.userData.email, this.userData.password)
        .then((success) => {

          let user = firebase.auth().currentUser;
          let dateCreated = new Date();
          firebase.database().ref('accounts/' + user.uid).set({
            dateCreated,
            username: this.userData.username,
            name: this.userData.fullname,
            userId: user.uid,
            email: user.email,
            online: true,
            phonenumber: this.userData.phone,
            description: "I am available",
            provider: "Email",
            img: this.img
          });
          this.loadingProvider.hide();
          this.closeModel();

        })
        .catch((error) => {
          console.log(error);
          this.loadingProvider.hide();
          let code = error["code"];
          this.alertProvider.showErrorMessage(code);
        });
    }
  }

  closeModel() {
    this.navCtrl.pop();
  }

}
