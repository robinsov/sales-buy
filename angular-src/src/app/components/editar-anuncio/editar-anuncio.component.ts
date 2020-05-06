import { Component, OnInit } from '@angular/core';
import { AnunciosService } from 'src/app/services/anuncios.service';
import { ActivatedRoute } from '@angular/router';
import { Anuncio } from '../models/anuncio.model';

@Component({
  selector: 'app-editar-anuncio',
  templateUrl: './editar-anuncio.component.html',
  styleUrls: ['./editar-anuncio.component.css']
})
export class EditarAnuncioComponent implements OnInit {

  constructor(private _anuncioService: AnunciosService,
              private activateRoute: ActivatedRoute) { 
                
              }

  ngOnInit(): void {
  }






}
