import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(public wsService: WebsocketService ) { }


  sendMessage(mensaje: any){
  this.wsService.emit('message', mensaje);
  }

  sendNotificacion(notificacion: any){
  this.wsService.emit('newMessage', notificacion);
  }

  getMessages(){
    return this.wsService.listen('message');
  }

  getNotificaciones(){
    return this.wsService.listen('newMessage');
  }



}
