import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Anuncio } from '../models/anuncio.model';
import { AnunciosService } from 'src/app/services/anuncios.service';

import Swiper from 'swiper';

@Component({
  selector: 'app-tarjetas-anuncios',
  templateUrl: './tarjetas-anuncios.component.html',
  styleUrls: ['./tarjetas-anuncios.component.css']
})
export class TarjetasAnunciosComponent implements OnInit {

  @Input() anuncios: Anuncio[];
  @Input() tipo: string;

  @Output() borrar = new EventEmitter<any>();


 

  constructor(public _anuncioService: AnunciosService) {
    

  }

  ngOnInit(): void {
   
    
  }

  borrarAnuncio(id: string){
    this.borrar.emit(id);
  }

}
