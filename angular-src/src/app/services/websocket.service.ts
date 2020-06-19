import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket:Socket) { }

  emit( evento :string, payload?: any, callback?: Function ){
    this.socket.emit( evento, payload );
  }

  listen(evento: string){
      return this.socket.fromEvent(evento);
  }
}
