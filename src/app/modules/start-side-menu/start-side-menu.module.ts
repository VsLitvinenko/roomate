import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StartSideMenuRoutingModule } from './start-side-menu-routing.module';
import { StartSideMenuPage } from './view/start-side-menu.page';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { DirectStartSideComponent } from './pages/direct-start-side/direct-start-side.component';
import { ChannelStartSideComponent } from './pages/channel-start-side/channel-start-side.component';
import { SharedModule } from '../shared/shared.module';

const commonComponents = [
  ProfileHeaderComponent,
];

const pagesComponents = [
  DirectStartSideComponent,
  ChannelStartSideComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    StartSideMenuRoutingModule,
  ],
  declarations: [
    StartSideMenuPage,
    ...commonComponents,
    ...pagesComponents,
  ]
})
export class StartSideMenuModule {}
