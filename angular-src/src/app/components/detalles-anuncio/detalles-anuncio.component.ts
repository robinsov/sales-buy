import { Component, OnInit, EventEmitter } from '@angular/core';
import { Anuncio } from '../models/anuncio.model';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IImage } from '../models/image.model';
import { ILike } from '../models/like.model';
import { from } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { VendedorService } from 'src/app/services/vendedor.service';
import { Vendedor } from '../models/vendedor.model';

@Component({
  selector: 'app-detalles-anuncio',
  templateUrl: './detalles-anuncio.component.html',
  styleUrls: ['./detalles-anuncio.component.css']
})
export class DetallesAnuncioComponent implements OnInit {

  existeChat: boolean;

  anuncio : Anuncio ;
  idAnuncio: string;
  images: IImage[];
  like: ILike;
  termino: string;
  likeAnuncio = false;
  countLikes:number = 0;
  likesObtenidos: any;
  idLike: string;
  mensaje: string = '';
  dejarMensaje = false;
  anuncioPropio = false;

  vendedorMensaje: Vendedor
  
  constructor(private _anuncioService: AnunciosService,
              private _vendedorService: VendedorService,
              private router: Router,
              private activateRouter: ActivatedRoute) {
                
              }

  ngOnInit(): void {
    
    this.getVendedor()

    this.activateRouter.params.subscribe(  resp => {

      if(resp['termino']){
        this.termino = resp['termino'];
      }
      this.idAnuncio =   resp['id'];
      this.getAnunci(resp['id']);
    })
    
    this._anuncioService.getImages(this.idAnuncio).subscribe(  (resp:any) => {
      this.images =   resp;
    });

    
    this._anuncioService.getlikeByIdanuncio(this.idAnuncio).subscribe( resp => {
      this.countLikes = resp.length
      this.likesObtenidos = resp;
      this.miLike();
    });

  
  }

  getVendedor(){
    this._vendedorService.getVendedor(localStorage.getItem('id')).subscribe( vendedor => {
      this.vendedorMensaje = vendedor;
    })
  }

  getlikes(){
    this._anuncioService.getlikeByIdanuncio(this.idAnuncio).subscribe( (resp:any) => {
      this.countLikes = resp.length
      this.likesObtenidos = resp;
    });
  }

  miLike(){
    from(this.likesObtenidos).pipe(
      map( resp => {
        if(resp['anuncio']['_id'] === this.idAnuncio ){
          this.idLike = resp['_id'];
          this.likeAnuncio = true
          return {id: resp['_id'], ok: true };
        }else{
          return {id: resp['_id'], ok: false };
        }
      }))
      .subscribe();
      
  }

  likes(){
    let newLike : ILike;
    this.likeAnuncio = !this.likeAnuncio;
    
    if(this.likeAnuncio){
      newLike = {
        anuncio: this.idAnuncio,
        vendedor: localStorage.getItem('id'),
      }
      this._anuncioService.newLike( newLike).subscribe(resp => {
        this.idLike = resp._id;
        this.getlikes();
      });
    }else {
      this.disLike();
      
    }
  }

  disLike(){
    if(!this.likeAnuncio){
      this._anuncioService.borrarLike( this.idLike ).subscribe(resp => {
        this.getlikes();
      });
    }
  }

  existeConversacion(){
    this._anuncioService.getAllMensajes().subscribe(mensajes => {
      
      if(mensajes.length > 0){
        for (var indice in mensajes) {
          
          if(String(mensajes[indice].anuncio._id ) === String(this.idAnuncio) && String(mensajes[indice].vendedor._id) === String(localStorage.getItem('id'))){
            alert(`ya tiene una conversacion con el vendedor ${mensajes[indice].vendedor.nombre}`)
            this.existeChat = true;
            return
          }else{
            this.existeChat = false;
            this.dejarMensaje = true;
            return
          }
        } 
      }else{
        this.existeChat = false;
        this.dejarMensaje = true;
      }
    })
    
  }

  enviarMensaje(){

    let newMessage = {
      mensaje: {
        mensaje: this.mensaje,
        usuario: this.vendedorMensaje
      },
      anuncio: this.idAnuncio,
      vendedor: this.vendedorMensaje
    }

    if(!this.existeChat){
      this.envioMensaje(newMessage);
    }
    
  }

  envioMensaje(newMessage){
    this._anuncioService.newMensaje(newMessage).subscribe( resp => {
      this.mensaje = '';
      this.dejarMensaje = false;
    })

  }


  getAnunci(id: string){
    this._anuncioService.getAnuncio(id).subscribe(  ( resp: any) => {
      this.anuncio =   resp.anuncioBD
      this.VerificarAnuncioConMiId();
    })
  }

  VerificarAnuncioConMiId(){
    if( this.anuncio.vendedor['_id'] === localStorage.getItem('id')  ){
      this.anuncioPropio = true;
    }
 
  }

  navegar(){
    if(this.termino){
      this.router.navigate(['/anuncios', 'search', this.termino])
    }else {
      this.router.navigate(['/anuncios', 'nav'])

    }
    
  }

  
}
