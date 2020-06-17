import { Component, OnInit, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { AnunciosService } from 'src/app/services/anuncios.service';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  nombreVendedor: string;
  img: string;
  termino: string;
  
  id: string

  mensajesNuevos= false;
  constructor(private _loginService: LoginService,
              private _anuncioService: AnunciosService,
              private router: Router) {
              this.id = localStorage.getItem('id');    
  }

  ngOnInit(): void {

  if(localStorage.getItem('vendedor')){
    this.nombreVendedor = localStorage.getItem('vendedor');
  }

  this._loginService.nombre.subscribe( nombre => {
    this.nombreVendedor = nombre
  })
  
  this._loginService.img.subscribe( img => {
    this.img = img
  })

  this._anuncioService.mensajesNuevos.subscribe( resp => {
    // console.log(resp);
    this.mensajesNuevos = resp;
  })
}
  

  logout(){
    this._loginService.logout();
  }


  perfil(){
    this.router.navigate(['/perfil', localStorage.getItem('id')]);
  }

  misMensajes(){
    this.router.navigate(['/sideBarMensajes']);
    this._anuncioService.mensajesNuevos.emit(false);
  }

  search(){

    if(!this.termino){
      alert('Digite un término de búsqueda')
      return;
    }else{
      this.router.navigate(['/anuncios', 'search', this.termino]);
    }


  }

}
