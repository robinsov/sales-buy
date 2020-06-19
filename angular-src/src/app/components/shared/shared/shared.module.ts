import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from '../../no-data/no-data.component';
import { NavigationComponent } from '../../navigation/navigation.component';
import { ImagenModule } from 'src/app/pipes/imagen.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContolDirective } from 'src/app/directives/contol.directive';
import { TarjetasAnunciosComponent } from '../../tarjetas-anuncios/tarjetas-anuncios.component';
import { CategoriasComponent } from '../../categorias/categorias.component';
import { PerfilComponent } from '../../perfil/perfil.component';
import { MisMensajesComponent } from '../../mis-mensajes/mis-mensajes.component';
import { SidebarMensajesComponent } from '../../sidebar-mensajes/sidebar-mensajes.component';
import { LoginControlDirective } from 'src/app/directives/login-control.directive';



import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    NoDataComponent,
    NavigationComponent,
    ContolDirective,
    TarjetasAnunciosComponent,
    CategoriasComponent,
    PerfilComponent,
    MisMensajesComponent,
    SidebarMensajesComponent,
    LoginControlDirective,

  ],
  imports: [
    ImagenModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  exports: [
    NoDataComponent,
    NavigationComponent,
    ContolDirective,
    TarjetasAnunciosComponent,
    CategoriasComponent,
    PerfilComponent,
    MisMensajesComponent,
    SidebarMensajesComponent
  ]
})
export class SharedModule { }
