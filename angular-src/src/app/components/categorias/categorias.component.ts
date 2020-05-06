import { Component, OnInit, EventEmitter } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { Categoria } from '../models/categoria.model';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { Router } from '@angular/router';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias: Categoria[];
  
  constructor(private _categoriasService: CategoriasService,
              private _anunciosServices: AnunciosService,
              private router: Router) { }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(){
    this._categoriasService.getCategorias().subscribe( resp => {
      this.categorias = resp
      console.log(resp);
    })
  }

}
