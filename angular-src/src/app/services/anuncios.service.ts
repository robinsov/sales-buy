import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Anuncio } from '../components/models/anuncio.model';

import { map } from 'rxjs/operators';
import { Socket } from "ngx-socket-io";


@Injectable({
  providedIn: 'root'
})
export class AnunciosService {

  anunciosPorCategorias : any[];
  imagesSegunAnuncio: any[];

  mensajesNuevos = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
                
              }

  getAnuncios(){
    return this.http.get(`${environment.API_URI}/anuncio`).pipe( map (  (resp:any) => {
      return  resp.anuncios;
    }));
  }
  
  getAnuncio(id: string){
    
    return this.http.get(`${environment.API_URI}/anuncio/${id}`);
  }


  getMisAnuncios(id:string){
    
    return this.http.get(`${environment.API_URI}/misAnuncios/${id}`).pipe( 
      map( resp => {
        return resp;
      })
    )
  }
  
  createAnuncio(anuncio: Anuncio, token:string ){
    let httpHeaders = new HttpHeaders({
      token: token
    })
    return  this.http.post(`${environment.API_URI}/anuncio`, anuncio, {headers: httpHeaders} )
    .pipe( map (  (resp:any) => {
      return  resp.anuncioBD
    }))
  }

  uploadImage(id:string, tipo:string, imagen: any ){
    const formData = new FormData();
    formData.append('archivo', imagen, imagen.name);

    return  this.http.put(`${environment.API_URI}/upload/${tipo}/${id}`, formData )
    .pipe( map (  (resp:any)=> {
        return resp.imageBD;
    }))
  }
  
  updateAnuncio(anuncio: any, id:string){

    return this.http.put(`${environment.API_URI}/anuncio/${id}`, anuncio)
    .pipe( map (  (resp:any) => {
      return  resp.anuncioBD
    }))
  }

  newLike(like){
    return this.http.post(`${environment.API_URI}/like/`, like).pipe( map (  (resp:any) => {
      return  resp.likeBD
    }))
  }

  getlikeByIdanuncio(idAnuncio: string){
    return this.http.get(`${environment.API_URI}/like/${idAnuncio}`).pipe( map (  (resp:any) => {
      return  resp.likesAnuncios
    }))
  }

  getLikes(){
    return this.http.get(`${environment.API_URI}/like/`).pipe( map (  (resp:any) => {
      return  resp.likeBD
    }))
  }

  borrarLike(id: string){
    return this.http.delete(`${environment.API_URI}/like/${id}`).pipe( map (  (resp:any) => {
      return  resp.likeBorradoBD;
    }))
  }
  
  deleteAnuncio(id: string){
    return this.http.delete(`${environment.API_URI}/anuncio/${id}`);
  }

  getImage(imagen: string){
    // localhost:3000/image/anuncios/5ea8c7c3723fe74328011308-302.png?token=
    return this.http.get(`${environment.API_URI}/image/anuncios/${imagen}?token=${localStorage.getItem('token')}`);
  }

  // getImages(idAnuncio: string){
  //   return this.http.get(`${environment.API_URI}/image/${idAnuncio}`).subscribe( (resp:any) => {
  //     console.log(resp.imagesAnuncio);
  //     this.imagesSegunAnuncio = resp.imagesAnuncio;
  //   });
  // }

  getImages(idAnuncio: string){
    return this.http.get(`${environment.API_URI}/image/${idAnuncio}`).pipe( map (  (resp:any) => {
      return  resp.imagesAnuncio;
    }))
  }

  deleteImage(id:string){
    return this.http.delete(`${environment.API_URI}/image/${id}`).pipe( map (  (resp:any) => {
      return  resp.imageBDBorrada;
    })) ;
  }

  getAnunciosPorCategorias(id:string){
    return this.http.get(`${environment.API_URI}/anunciosCategorias/${id}`);
    
  }


  getAnunciosPorTermino(termino:string){
    return this.http.get(`${environment.API_URI}/anuncios/${termino}`);
  }



  newMensaje(mensaje){
    return this.http.post(`${environment.API_URI}/mensaje`, mensaje).pipe( map (  (resp:any) => {
      return  resp.mensajesBD
    }))
  }

  updateMensaje(id:string, mensaje:any){
    // console.log(mensaje);
    return this.http.put(`${environment.API_URI}/mensajeUpdate/${id}`, mensaje).pipe( map (  (resp:any) => {
      return  resp.mensajesBD;
    }))
  }

  mensajeLeido(id:string, mensaje:any){
    // console.log(mensaje);
    return this.http.put(`${environment.API_URI}/mensajeLeido/${id}`, mensaje).pipe( map (  (resp:any) => {
      return  resp.mensajesBD;
    }))
  }

  getMensajeByIdAnuncio(idAnuncio: string){
    return this.http.get(`${environment.API_URI}/mensajeAnuncio/${idAnuncio}`).pipe( map (  (resp:any) => {
      return  resp.mensajes
    }))
  }

  getMensajes(id: string){
    return this.http.get(`${environment.API_URI}/mensaje/${id}`).pipe( map (  (resp:any) => {
      return  resp.mensajes
    }))
  }

  getMensaje(idMensaje: string){
    return this.http.get(`${environment.API_URI}/mensajeGuardado/${idMensaje}`).pipe( map (  (resp:any) => {
      return  resp.mensajeBD
    }))
  }

  getAllMensajes(){
    return this.http.get(`${environment.API_URI}/mensaje`).pipe( map (  (resp:any) => {
      return  resp.mensajesBD
    }))
  }


  borrarMensaje(id: string){
    return this.http.delete(`${environment.API_URI}/mensaje/${id}`).pipe( map (  (resp:any) => {
      return  resp.mensajeBorradoBD;
    }))
  }

}
