import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginProvider } from '../../providers/login/login';
import { SignupPage } from '../signup/signup';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  public emailFormControl = new FormControl('', [
    Validators.email,
    Validators.required
  ]);

  public passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  public userData = { "email": "", "password": "" };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loginProvider: LoginProvider,
    public firebaseProvider: FirebaseProvider,
  ) {
    this.loginProvider.setNavController(this.navCtrl);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
    // if (this.loginProvider.getCurrentLoggedUser() === "") {
    //   // this.firebaseProvider.setOfflineState();
    // } else {
    //   this.userData.email = this.loginProvider.getCurrentLoggedUser().email;
    //   this.userData.password = this.loginProvider.getCurrentLoggedUser().password;
    //   this.loginProvider.emailLogin(this.userData.email, this.userData.password);
    // }
  }

  login(signinUser) {
    console.log(signinUser);
    if (signinUser.valid) {
      this.loginProvider.emailLogin(this.userData.email, this.userData.password);
    }
  }

  registerModel() {
    this.navCtrl.push(SignupPage);
  }

  forgotPassword() {
    this.loginProvider.sendPasswordReset(this.userData.email);
    this.clearForms();
  }

  clearForms() {
    this.userData.email = '';
    this.userData.password = '';
  }

}
