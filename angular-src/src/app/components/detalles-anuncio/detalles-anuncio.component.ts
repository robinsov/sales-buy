import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Anuncio } from '../models/anuncio.model';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalles-anuncio',
  templateUrl: './detalles-anuncio.component.html',
  styleUrls: ['./detalles-anuncio.component.css']
})
export class DetallesAnuncioComponent implements OnInit, AfterViewInit {


  anuncio : Anuncio ;
  idAnuncio: string;
  images: any[];
  
  constructor(private _anuncioService: AnunciosService,
              private activateRouter: ActivatedRoute) {
                this.activateRouter.params.subscribe( resp => {
                  this.idAnuncio = resp['id'];
                  this.getAnuncio( resp['id']);
                })
              }

  ngOnInit(): void {
    
    this._anuncioService.getImages(this.idAnuncio).subscribe(resp => {
      this.images = resp;
    })
  }

  ngAfterViewInit() {
    
  }

  getAnuncio(id: string){
    this._anuncioService.getAnuncio(id).subscribe( (resp: any) => {
      console.log(resp);
      this.anuncio = resp.anuncioBD
    })
  }

  
}
