import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AnunciosComponent } from "./components/anuncios/anuncios.component";
import { LoginComponent } from "./components/login/login.component";
import { AnuncioFormComponent } from "./components/anuncio-form/anuncio-form.component";
import { MisAnunciosComponent } from "./components/mis-anuncios/mis-anuncios.component";
import { PerfilComponent } from "./components/perfil/perfil.component";
import { DetallesAnuncioComponent } from "./components/detalles-anuncio/detalles-anuncio.component";
import { EditarAnuncioComponent } from "./components/editar-anuncio/editar-anuncio.component";
import { CategoriasComponent } from "./components/categorias/categorias.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "anuncios/:source",
    component: AnunciosComponent,
    
  },
  {
    path: "anuncios/:source/:valor",
    component: AnunciosComponent,
    
  },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "categorias",
    component: CategoriasComponent,
    
  },
  {
    path: "misAnuncios",
    component: MisAnunciosComponent,
    
  },
  { path: "perfil/:id", component: PerfilComponent,  },
  {
    path: "detalles/:id",
    component: DetallesAnuncioComponent,
    
  },

  {
    path: "anuncio/:source",
    component: AnuncioFormComponent,
    
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
