import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatOneToOnePage } from './chat-one-to-one';

@NgModule({
  declarations: [
    ChatOneToOnePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatOneToOnePage),
  ],
})
export class ChatOneToOnePageModule {}
