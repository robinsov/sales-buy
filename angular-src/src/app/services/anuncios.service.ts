import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Anuncio } from '../components/models/anuncio.model';

import { map } from 'rxjs/operators';
import { LoginService } from './login.service';


@Injectable({
  providedIn: 'root'
})
export class AnunciosService {

  anunciosPorCategorias : any[];
  imagesSegunAnuncio: any[];

  httpHeaders = new HttpHeaders({
    token: localStorage.getItem('token')
  })

  constructor(private http: HttpClient,
              private _loginService: LoginService) { }

  getAnuncios(){
    return this.http.get(`/anuncio`).pipe( map ((resp:any) => {
      return resp.anuncios;
    }));
  }
  
  getAnuncio(id: string){
    return this.http.get(`/anuncio/${id}`);
  }


  getMisAnuncios(id:string){
    return this.http.get(`/misAnuncios/${id}`)
  }
  
  createAnuncio(anuncio: Anuncio ){
    
    return this.http.post(`/anuncio`, anuncio, {headers: this.httpHeaders} )
    .pipe( map ((resp:any) => {
      return resp.anuncioBD
    }))
  }

  uploadImage(id:string, tipo:string, imagen: any ){
    const formData = new FormData();
    formData.append('archivo', imagen, imagen.name);

    return this.http.put(`/upload/${tipo}/${id}`, formData )
    .pipe( map ( (resp:any)=> {
      return resp.imageBD;
    }))
  }
  
  updateAnuncio(anuncio: any, id:string){

    return this.http.put(`/anuncio/${id}`, anuncio)
    .pipe( map ((resp:any) => {
      return resp.anuncioBD
    }))
  }
  
  deleteAnuncio(id: string){
    return this.http.delete(`/anuncio/${id}`);
  }

  getImage(imagen: string){
    // localhost:3000/image/anuncios/5ea8c7c3723fe74328011308-302.png?token=
    return this.http.get(`/image/anuncios/${imagen}?token=${localStorage.getItem('token')}`);
  }

  // getImages(idAnuncio: string){
  //   return this.http.get(`${environment.API_URI}/image/${idAnuncio}`).subscribe( (resp:any) => {
  //     console.log(resp.imagesAnuncio);
  //     this.imagesSegunAnuncio = resp.imagesAnuncio;
  //   });
  // }

  getImages(idAnuncio: string){
    return this.http.get(`/image/${idAnuncio}`).pipe( map ( (resp:any) => {
      return resp.imagesAnuncio;
    }))
  }

  deleteImage(id:string){
    return this.http.delete(`/image/${id}`).pipe( map ((resp:any) => {
      return resp.imageBDBorrada;
    })) ;
  }

  getAnunciosPorCategorias(id:string){
    return this.http.get(`/anunciosCategorias/${id}`);
    
  }


  getAnunciosPorTermino(termino:string){
    return this.http.get(`/anuncios/${termino}`);
  }

}
