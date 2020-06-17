import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Anuncio } from '../models/anuncio.model';
import { AnunciosService } from 'src/app/services/anuncios.service';

import Swiper from 'swiper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjetas-anuncios',
  templateUrl: './tarjetas-anuncios.component.html',
  styleUrls: ['./tarjetas-anuncios.component.css']
})
export class TarjetasAnunciosComponent implements OnInit {

  page: number = 1; 



  @Input() anuncios: Anuncio[];
  @Input() tipo: string;
  @Input() termino: string;

  @Output() borrar = new EventEmitter<any>();


 

  constructor(public _anuncioService: AnunciosService,
              private router:Router) {
    

  }

  trackByFn(anuncio: Anuncio){
    return anuncio._id;
  }

  navegar(id: string){
    if(this.termino){
      this.router.navigate(['/detalles', id, this.termino])
    }else {
      this.router.navigate(['/detalles', id])
    }
  }

  ngOnInit(): void {
  }

  borrarAnuncio(id: string){
    this.borrar.emit(id);
  }

}
