import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';

import { AutosizeModule } from 'ngx-autosize';
import { PipesModule } from 'src/app/Pipe/pipes.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    AutosizeModule,
    PipesModule,
    MatTabsModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
