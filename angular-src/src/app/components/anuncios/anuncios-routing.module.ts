import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnunciosComponent } from './anuncios.component';
import { MisAnunciosComponent } from '../mis-anuncios/mis-anuncios.component';
import { PerfilComponent } from '../perfil/perfil.component';
import { DetallesAnuncioComponent } from '../detalles-anuncio/detalles-anuncio.component';
import { AnuncioFormComponent } from '../anuncio-form/anuncio-form.component';
import { CategoriasComponent } from '../categorias/categorias.component';
import { CanDeactiveGuard } from 'src/app/guards/can-deactive.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: "anuncios/:source/:valor",
    component: AnunciosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "anuncios/:source",
    component: AnunciosComponent,
    canActivate: [AuthGuard]
  },
  {
      path: "misAnuncios",
      component: MisAnunciosComponent,
      canActivate: [AuthGuard]
  },
  
  { path: "perfil/:id", component: PerfilComponent, 
    canDeactivate: [CanDeactiveGuard],
    canActivate: [AuthGuard] },
  {
    path: "detalles/:id",
    component: DetallesAnuncioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "categorias",
    component: CategoriasComponent,
    canActivate: [AuthGuard]
  },

  {
    path: "anuncio/:source",
    component: AnuncioFormComponent,
    canActivate: [AuthGuard]
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnunciosRoutingModule { }