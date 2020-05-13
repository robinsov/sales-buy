import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthGuard } from "./guards/auth.guard";
import { PaginasComponent } from './components/anuncios/paginas.component';

const routes: Routes = [
  {
    path: '',
    component: PaginasComponent,
    loadChildren: () => import('./components/anuncios/anuncios.module').then( mod => mod.AnunciosModule)
  },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
