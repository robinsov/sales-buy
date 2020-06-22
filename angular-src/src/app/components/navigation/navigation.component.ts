import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';



@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  nombreVendedor: string;
  img: string;
  termino: string;
  notificacion: Subscription;
  id: string

  mensajesNuevos= false;
  constructor(private _loginService: LoginService,
              private _csService: ChatService,
              private router: Router) {
              this.id = localStorage.getItem('id');
  }


  ngOnInit(): void {

  this.notificacion = this._csService.getNotificaciones().subscribe( (noti:any) => {
    if(noti){
      this.mensajesNuevos = true;
    }else{
      this.mensajesNuevos = false;
    }
  })

  if(localStorage.getItem('vendedor')){
    this.nombreVendedor = localStorage.getItem('vendedor');
  }

  this._loginService.nombre.subscribe( nombre => {
    this.nombreVendedor = nombre
  })

  this._loginService.img.subscribe( img => {
    this.img = img
  })


}


logout(){
  this._loginService.logout();
  }


  perfil(){
    this.router.navigate(['/perfil', localStorage.getItem('id')]);
  }

  misMensajes(){
    this.mensajesNuevos = false;
    this.router.navigate(['/sideBarMensajes']);
  }

  search(){

    if(!this.termino){
      alert('Digite un término de búsqueda')
      return;
    }else{
      this.router.navigate(['/anuncios', 'search', this.termino]);
    }


  }

  ngOnDestroy(): void {
    this.notificacion.unsubscribe();
  }

}
