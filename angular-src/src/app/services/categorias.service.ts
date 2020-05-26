import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ajax, AjaxError } from 'rxjs/ajax';
import { map, pluck, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Categoria } from '../components/models/categoria.model';


@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  
  constructor(private http: HttpClient) { }
  
  // getCategorias(){
  //   return this.http.get(`${environment.API_URI}/categoria`).pipe( 
  //     map ((resp:any) => {
  //     return resp.categorias;
  //   }));
  // }
  
  getCategorias(){
    return this.http.get(`${environment.API_URI}/categoria`).pipe( 
      pluck('categorias'),
      catchError( this.atrapaError )
      );
  }


  getCategoriasAjax(){
    return ajax( `${environment.API_URI}/categoria`).pipe(
      pluck('response','categorias'),
      catchError( this.atrapaError )
      )
    }

  atrapaError = (err: AjaxError) => {
      console.warn('el error es:', err.message);
      return of([]);
  }
}
