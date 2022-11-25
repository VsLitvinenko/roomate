import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './main/app.component';
import { AppRoutingModule } from './app-routing.module';
import { TabsComponent } from './main/components/tabs/tabs.component';
import { ProfileHeaderComponent } from './main/components/profile-header/profile-header.component';
import { MenuControllerService } from './main/services/menu-controller.service';

@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    ProfileHeaderComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    MenuControllerService,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {}
