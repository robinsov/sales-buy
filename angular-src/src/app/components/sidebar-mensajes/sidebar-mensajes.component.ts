import { Component, OnInit, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { from, Subscription } from 'rxjs';
import { distinct, map  } from 'rxjs/operators';
import { Router } from '@angular/router';



import { Socket } from "ngx-socket-io";
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-sidebar-mensajes',
  templateUrl: './sidebar-mensajes.component.html',
  styleUrls: ['./sidebar-mensajes.component.css']
})
export class SidebarMensajesComponent implements OnInit, OnDestroy{

  mensajesHp:any;
  mensajes: any[]= [];
  mensajeAEnviar: string = '';

  usuarioEnSession = localStorage.getItem('id');

  notificacion: Subscription;

  mensajesEncontrados: any[] = [];

  mensajeNotificado: any;

  constructor(private _anuncioService :AnunciosService,
              private router: Router,
              private _csService:ChatService) {

  }


  ngOnInit(): void {
    this.getTodosMensajes();

    // this.notificacion = this._csService.getNotificaciones().subscribe((resp:any) => {
    //   if(resp){
    //     this._anuncioService.getMensaje(resp.id_mensaje).subscribe( not => {
    //       console.log(not);
    //     })
    //   }
    // })
  }


  getTodosMensajes(){
    this.mensajesHp = new EventEmitter
    this._anuncioService.getAllMensajes().subscribe(mensajes => {
      console.log('hp', mensajes);

      mensajes.forEach(element => {
        if(String(element.anuncio.vendedor) === localStorage.getItem('id')){
          this.mensajesEncontrados.push(element)
        }
        element.mensaje.forEach(element2 => {

          if(String(element2.usuario._id) === localStorage.getItem('id')){
            this.mensajesEncontrados.push(element);
          }
        });
      });
      this.mensajesHp.emit(this.mensajesEncontrados);
    })

    this.llenarMensajes();

  }

  llenarMensajes(){
    this.mensajesHp.subscribe( (r:any)=> {
      from( r ).pipe(
        distinct( (p:any) => p._id)
        ).subscribe( (resp:any) => {
          console.log('aqui', resp);
          this.mensajes.push(resp)
    });
    })
  }


  chat(id: string){

    let payload = {
      leidoPor: localStorage.getItem('id')
    }

    this._anuncioService
      .mensajeLeido(id, payload)
      .subscribe(resp => {
        console.log(resp);
      });


    this.router.navigate(['/misMensajes',  id]);

  }

  buscarTermino(termino: string){
    if(termino.length === 0) {
      alert('Digíte un término de busqueda')
      this.mensajes = [];
      this.getTodosMensajes();
      return;
    }

    let encontrados: any[] = [];
    console.log(this.mensajes);

    this.mensajes.forEach(element => {
        if(element.vendedor.nombre.toLowerCase().indexOf(termino.toLowerCase()) >= 0
          || element.anuncio.tituloAnuncio.toLowerCase().indexOf(termino.toLowerCase()) >= 0 ){
          console.log(element);
          encontrados.push(element);
        }
    });

    if(encontrados.length > 0){
      this.mensajes = encontrados;
    }
  }

  ngOnDestroy(): void {

    if(this.notificacion){
      this.notificacion.unsubscribe();
    }
  }


}
