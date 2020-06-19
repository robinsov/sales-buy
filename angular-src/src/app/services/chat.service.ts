import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public wsService: WebsocketService ) { }
  sendMessage(mensaje: any){
    const payload = {
      mensaje
    };

  this.wsService.emit('message', payload);
  }


  getMessages(){
    return this.wsService.listen('message');
  }
}
