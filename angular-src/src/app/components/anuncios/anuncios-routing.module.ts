import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnunciosComponent } from './anuncios.component';
import { MisAnunciosComponent } from '../mis-anuncios/mis-anuncios.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { DetallesAnuncioComponent } from '../detalles-anuncio/detalles-anuncio.component';
import { AnuncioFormComponent } from '../anuncio-form/anuncio-form.component';
import { CategoriasComponent } from '../categorias/categorias.component';

const routes: Routes = [
  {
    path: "anuncios/:source/:valor",
    component: AnunciosComponent
  },
  {
    path: "anuncios/:source",
    component: AnunciosComponent
  },
  {
      path: "misAnuncios",
      component: MisAnunciosComponent
  },
  
  { path: "perfil/:id", component: PerfilComponent, canActivate: [] },
  {
    path: "detalles/:id",
    component: DetallesAnuncioComponent,
    canActivate: [],
  },
  {
    path: "categorias",
    component: CategoriasComponent,
    canActivate: [],
  },

  {
    path: "anuncio/:source",
    component: AnuncioFormComponent,
    canActivate: [],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnunciosRoutingModule { }