import { Component, OnInit, ViewChild, ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { from } from 'rxjs';
import { map, distinct, distinctUntilKeyChanged, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-mensajes',
  templateUrl: './sidebar-mensajes.component.html',
  styleUrls: ['./sidebar-mensajes.component.css']
})
export class SidebarMensajesComponent implements OnInit {

  mensajesHp = new EventEmitter;

  mensajes: any[]= [];

  btnResponder = false;
  btnEnviar = false;
  mensajeAEnviar: string = '';
  btnContestado = false;

  mensajesEncontrados: any[] = [];



  constructor(private _anuncioService :AnunciosService,
              private router: Router,
              private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getAllMensajes();
  }


  getAllMensajes(){
    
    this._anuncioService.getAllMensajes().subscribe(mensajes => {
      mensajes.forEach(element => {
        if(String(element.anuncio.vendedor) === localStorage.getItem('id')){
          this.mensajesEncontrados.push(element)
        }
        element.mensaje.forEach(element2 => {
          if(String(element2.usuario._id) === localStorage.getItem('id')){
            this.mensajesEncontrados.push(element)
          }
        });
      });
      console.log(this.mensajesEncontrados);
      this.mensajesHp.emit(this.mensajesEncontrados);
    })

    this.mensajesHp.subscribe( (r:any)=> {
      from( r ).pipe(
        distinct( p => p['_id'] )
        ).subscribe( (resp:any) => {
          // console.log(resp);
      this.mensajes.push(resp)
    });
    })
    
  }


  chat(id: string){
    this.router.navigate(['/misMensajes',  id]);
  }

  buscarTermino(termino: string){
    if(termino.length === 0) {
      this.resetMensajes();
      alert('Digíte un termino de busqueda')
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
    
    if(encontrados){
      this.mensajes = encontrados;
    }

  }

  resetMensajes(){
    this.mensajes = [];
    // this.getAllMensajes();
  }

}
