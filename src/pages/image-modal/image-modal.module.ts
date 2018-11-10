import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageModalPage } from './image-modal';

@NgModule({
  declarations: [
    ImageModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageModalPage),
  ],
})
export class ImageModalPageModule {}
