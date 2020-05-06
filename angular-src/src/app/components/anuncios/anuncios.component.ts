import { Component, OnInit, Host } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { Anuncio } from '../models/anuncio.model';
import { MisAnunciosComponent } from '../mis-anuncios/mis-anuncios.component';
import { TarjetasAnunciosComponent } from '../tarjetas-anuncios/tarjetas-anuncios.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css']
})
export class AnunciosComponent implements OnInit {

  anuncios : Anuncio[] = [];
  source: string;
  valor: string;
  constructor(private _anuncioService: AnunciosService,
              private activateRoute: ActivatedRoute) { 
               
              }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(resp => {
      this.source = resp['source'];
      if(resp['valor']){
        this.valor = resp['valor'];

        if(this.source === 'search') {
          console.log('entro a anuncios desde search');
          this.getAnunciosSearch(this.valor)
        }
        if(this.source === 'cat') {
          console.log('entro a anuncios desde categorias');
          this.getAnunciosCategorias(this.valor)
        }
      }

      if(this.source){
        if(this.source === 'nav'){
          console.log('entro a anuncios desde nav');
          this.getAnunciosNav()
        }
        
      }                
    })
    
  }

  getAnunciosNav(){
    this._anuncioService.getAnuncios().subscribe( (resp:any) => {
      this.anuncios = resp;
    })
  }


  getAnunciosCategorias(id: string){
    this._anuncioService.getAnunciosPorCategorias(id).subscribe((resp:any)=> {
      this.anuncios = resp.misCategorias;
    })
  }


  getAnunciosSearch(termino: string){
    this._anuncioService.getAnunciosPorTermino(termino).subscribe((resp:any)=> {
      console.log(resp.anunciosEncontrados);
      this.anuncios = resp.anunciosEncontrados;
      console.log(this.anuncios);
    })
  }


}
