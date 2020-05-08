import { Component, OnInit, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  nombreVendedor: string;
  img;
  termino: string;
  
  id: string
  constructor(private _loginService: LoginService,
              private router: Router) {
              this.id = localStorage.getItem('id');    
  }

  ngOnInit(): void {

    if(localStorage.getItem('vendedor')){
      this.nombreVendedor = localStorage.getItem('vendedor');
    }
    
    this._loginService.img.subscribe( async resp => {
      this.img =await resp
    })
    

    this._loginService.nombrelisto.subscribe( async resp => {
      this.nombreVendedor = await resp;
    })
  }

  logout(){
    this._loginService.logout();
  }


  perfil(){
    this.router.navigate(['/perfil', localStorage.getItem('id')]);
  }

  search(){
    if(this.termino.length <= 0){
      return
    }

    this.router.navigate(['/anuncios', 'search', this.termino]);
    this.termino = '';
  }

}
