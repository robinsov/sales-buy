import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoDataComponent } from '../../no-data/no-data.component';
import { NavigationComponent } from '../../navigation/navigation.component';
import { ImagenModule } from 'src/app/pipes/imagen.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContolDirective } from 'src/app/directives/contol.directive';
import { TarjetasAnunciosComponent } from '../../tarjetas-anuncios/tarjetas-anuncios.component';
import { CategoriasComponent } from '../../categorias/categorias.component';
import { PerfilComponent } from '../../perfil/perfil.component';



@NgModule({
  declarations: [
    NoDataComponent,
    NavigationComponent,
    ContolDirective,
    TarjetasAnunciosComponent,
    CategoriasComponent,
    PerfilComponent,
  ],
  imports: [
    ImagenModule,
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    NoDataComponent,
    NavigationComponent,
    ContolDirective,
    TarjetasAnunciosComponent,
    CategoriasComponent,
    PerfilComponent
  ]
})
export class SharedModule { }
