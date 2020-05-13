import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Vendedor } from '../components/models/vendedor.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnInit{

  token: string
  img = new EventEmitter;

  public changeLoginStatusSubject = new Subject<boolean>();
  public changeLoginStatus$ = this.changeLoginStatusSubject.asObservable();

  constructor(private http: HttpClient,
              private router : Router) { 
  }

  ngOnInit(): void {
    
  }


  login(vendedor: Vendedor){
    return this.http.post(`${environment.API_URI}/login`, vendedor).pipe( map ((resp:any) => {
      this.token = resp.token;
      return resp;
    }));
  }

  registroGoogle(token: string){
    return this.http.post(`${environment.API_URI}/login/google`, {token}).pipe( map ((resp:any) => {
      this.token = resp.token;
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
      this.router.navigate(['/login']);
    }
  }

  estaLogueado(): boolean{
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token')
      return (this.token.length > 10)? true: false;
    }else{
      false
    }
  }
}
