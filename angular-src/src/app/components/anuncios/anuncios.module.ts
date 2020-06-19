import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AnunciosRoutingModule } from './anuncios-routing.module';
import { AnunciosComponent } from './anuncios.component';
import { MisAnunciosComponent } from '../mis-anuncios/mis-anuncios.component';
import { AnuncioFormComponent } from '../anuncio-form/anuncio-form.component';
import { DetallesAnuncioComponent } from '../detalles-anuncio/detalles-anuncio.component';
import { EditarAnuncioComponent } from '../editar-anuncio/editar-anuncio.component';
import { PruebaListenerComponent } from '../prueba-listener/prueba-listener.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagenModule } from 'src/app/pipes/imagen.module';
import { SharedModule } from '../shared/shared/shared.module';



@NgModule({
  declarations: [
    AnunciosComponent,
    MisAnunciosComponent,
    AnuncioFormComponent,
    DetallesAnuncioComponent,
    EditarAnuncioComponent,
    PruebaListenerComponent,

  ],
  exports:[
    AnunciosComponent,
    MisAnunciosComponent,
    AnuncioFormComponent,
    DetallesAnuncioComponent,
    EditarAnuncioComponent,
    PruebaListenerComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ImagenModule,
    SharedModule,
    AnunciosRoutingModule,
  ]
})
export class AnunciosModule { }
