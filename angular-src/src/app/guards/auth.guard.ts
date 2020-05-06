import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  result: boolean = false
  constructor(private _loginService: LoginService,
              private router: Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  
    this._loginService.tokenListo.subscribe( resp => {
      if(resp){
        this.result = true
      }else{
        
        this.result = false;
      }
    })

    if(!this.result){
      this.router.navigate(['/login']);
    }

    return this.result;

  }
  
}
