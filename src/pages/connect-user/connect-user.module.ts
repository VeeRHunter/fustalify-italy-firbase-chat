import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConnectUserPage } from './connect-user';

@NgModule({
  declarations: [
    ConnectUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ConnectUserPage),
  ],
})
export class ConnectUserPageModule {}
