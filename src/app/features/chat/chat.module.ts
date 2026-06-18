import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ChatPageComponent } from './chat-page/chat-page.component';

@NgModule({
  declarations: [ChatPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChatRoutingModule,
    SharedModule
  ]
})
export class ChatModule {}
