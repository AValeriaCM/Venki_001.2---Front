import { ImageModalPageModule } from './Pages/social/image-modal/image-modal.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './_material/material/material.module';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceErrorInterceptorService } from './_share/service-error-interceptor.service';
import { HttpClientModule } from '@angular/common/http';
import { PipesModule } from './Pipe/pipes.module';
import { firebaseConfig } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { PassObjectService } from './_services/pass-object.service';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PusherServiceService } from './_providers/pusher-service.service';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import * as Sentry from "@sentry/angular";
import { APP_INITIALIZER } from "@angular/core";
import { Router } from "@angular/router";
import { AvatarPageModule } from './Pages/popup/avatar/avatar.module';
//import { CondicionesPageModule } from './Pages/terminos/condiciones/condiciones.module';



@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  exports: [MaterialModule],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    PipesModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    InternationalPhoneNumberModule,
    ImageModalPageModule,
    AvatarPageModule
    
  ],
  providers: [
    MatDatepickerModule,
    StatusBar,
    SplashScreen,
    LocalNotifications,
    PreviewAnyFile,
    FCM,
    StreamingMedia,
    PassObjectService,
    PusherServiceService,
    GooglePlus,
    Facebook,
    Camera,
    ImagePicker,
    File,
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServiceErrorInterceptorService,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
