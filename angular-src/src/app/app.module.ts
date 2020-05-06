import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AnunciosComponent } from './components/anuncios/anuncios.component';
import { LoginComponent } from './components/login/login.component';
import { ImagenPipe } from './pipes/imagen.pipe';
import { AnuncioFormComponent } from './components/anuncio-form/anuncio-form.component';
import { MisAnunciosComponent } from './components/mis-anuncios/mis-anuncios.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DetallesAnuncioComponent } from './components/detalles-anuncio/detalles-anuncio.component';
import { TarjetasAnunciosComponent } from './components/tarjetas-anuncios/tarjetas-anuncios.component';
import { EditarAnuncioComponent } from './components/editar-anuncio/editar-anuncio.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { RegisterComponent } from './components/register/register.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { ContolDirective } from './directives/contol.directive';
import { PruebaListenerComponent } from './components/prueba-listener/prueba-listener.component';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AnunciosComponent,
    LoginComponent,
    ImagenPipe,
    AnuncioFormComponent,
    MisAnunciosComponent,
    PerfilComponent,
    DetallesAnuncioComponent,
    TarjetasAnunciosComponent,
    EditarAnuncioComponent,
    CategoriasComponent,
    RegisterComponent,
    NoDataComponent,
    ContolDirective,
    PruebaListenerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
  ],
  providers: [
    
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
