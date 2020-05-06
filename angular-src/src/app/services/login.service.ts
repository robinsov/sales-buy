import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Vendedor } from '../components/models/vendedor.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  token: string;

  nombrelisto = new EventEmitter<any>();

  tokenListo = new EventEmitter<any>();

  img = new EventEmitter;

  constructor(private http: HttpClient,
              private router : Router) { 
              if(localStorage.getItem('token')){
                this.token = localStorage.getItem('token');
              }
              
  }

  login(vendedor: Vendedor){
    return this.http.post(`${environment.API_URI}/login`, vendedor).pipe( map ((resp:any) => {
      localStorage.setItem('vendedor', resp.vendedor.nombre);
      this.nombrelisto.emit(resp.vendedor.nombre);
      this.tokenListo.emit(resp.token);
      return resp;
    }));
  }

  registrar(vendedor: Vendedor){
    return this.http.post(`${environment.API_URI}/vendedor`, vendedor);
  }

  logout(){
    if(localStorage.getItem('token')){
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('vendedor');
      this.nombrelisto.emit(null);
      this.router.navigate(['/login']);
    }
  }
}
