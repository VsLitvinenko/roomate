import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateChannelModalComponent } from './create-channel-modal.component';

@Injectable({
  providedIn: 'root'
})
export class CreateChannelModalService {

  constructor(private readonly modalCtrl: ModalController) {
  }

  public async openModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreateChannelModalComponent
    });
    await modal.present();
  }
}
