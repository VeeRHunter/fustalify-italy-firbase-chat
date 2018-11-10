import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChartsModule } from 'ng2-charts';

import { LoginProvider } from '../providers/login/login';
import { LoadingProvider } from '../providers/loading/loading';
import { AlertProvider } from '../providers/alert/alert';
import { LogoutProvider } from '../providers/logout/logout';


import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import * as firebase from 'firebase';
import { Camera } from '@ionic-native/camera';
import { Contacts } from '@ionic-native/contacts';
import { MediaCapture } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';



import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { ConnectUserPage } from '../pages/connect-user/connect-user';
import { ChatOneToOnePage } from '../pages/chat-one-to-one/chat-one-to-one';
import { DataProvider } from '../providers/data/data';
import { ImageProvider } from '../providers/image/image';
import { FirebaseProvider } from '../providers/firebase/firebase';
import { ImageModalPage } from '../pages/image-modal/image-modal';

const firebaseConfig = {
  apiKey: "AIzaSyBq_NRIX-3j9WL23V1U7jZS6Dq_9AyA1ek",
  authDomain: "fuality-app.firebaseapp.com",
  databaseURL: "https://fuality-app.firebaseio.com",
  projectId: "fuality-app",
  storageBucket: "fuality-app.appspot.com",
  messagingSenderId: "890064930607"
};


firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SigninPage,
    SignupPage,
    ConnectUserPage,
    ChatOneToOnePage,
    ImageModalPage,
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SigninPage,
    SignupPage,
    ConnectUserPage,
    ChatOneToOnePage,
    ImageModalPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    LoadingProvider,
    AlertProvider,
    LogoutProvider,
    DataProvider,
    ImageProvider,
    FirebaseProvider,
    Camera,
    Contacts,
    Contacts,
    MediaCapture,
    File,
    Geolocation,
  ]
})
export class AppModule { }
