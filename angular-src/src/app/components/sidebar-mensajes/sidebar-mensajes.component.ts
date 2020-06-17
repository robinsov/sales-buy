import { Component, OnInit, ViewChild, ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { from } from 'rxjs';
import { distinct, map  } from 'rxjs/operators';
import { Router } from '@angular/router';



import { Socket } from "ngx-socket-io";

@Component({
  selector: 'app-sidebar-mensajes',
  templateUrl: './sidebar-mensajes.component.html',
  styleUrls: ['./sidebar-mensajes.component.css']
})
export class SidebarMensajesComponent implements OnInit {

  mensajesHp;;

  yo = localStorage.getItem('id');
  mensajes: any[]= [];

  btnResponder = false;
  btnEnviar = false;
  mensajeAEnviar: string = '';
  btnContestado = false;

  mensajesEncontrados: any[] = [];

  nuevoMensaje: boolean;

  constructor(private _anuncioService :AnunciosService,
              private router: Router,
              private renderer: Renderer2,
              private socket: Socket) { }

  ngOnInit(): void {
    this.getAllMensajes();

    // this.ubicarMensaje();
  }

  ubicarMensaje(){
    this.socket.fromEvent('message').pipe(
      map( data => data )
    ).subscribe((resp:any) => {
      if(resp){
        console.log(resp);
        console.log(this.mensajes);
        this.mensajes.forEach((element, index) => {
          if(String(element._id ) === String(resp.idMensaje)){
            // this.mensajeLeido = resp.data.leido;
            
          }
        });
      }
    });
  }



  getAllMensajes(){
    this.mensajesHp = new EventEmitter
    this._anuncioService.getAllMensajes().subscribe(mensajes => {

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
          this.mensajes.push(resp)
    });
    })
  }


  chat(id: string){

    
    
    let mensajeYaLeido = {
      leido: localStorage.getItem('id'),
    };

    this._anuncioService
      .mensajeLeido(id, mensajeYaLeido)
      .subscribe(resp => {
      });

    this.router.navigate(['/misMensajes',  id]);

  }

  buscarTermino(termino: string){
    if(termino.length === 0) {
      alert('Digíte un término de busqueda')
      this.mensajes = [];
      this.getAllMensajes();
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


}
