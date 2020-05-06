import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, tipo:string) {
    let url = '';
    let token : string = '';

    if(!imagen){
      return url = 'assets/img/no-image.jpg';
    }
    
    if( imagen.indexOf( 'base64') >= 0){
      return imagen;
    }
    
    if(localStorage.getItem('token')){
      token = localStorage.getItem('token');
      url = imagen;
      return url;
      
    }else{
      return url += 'No existe token aun';
    }
    
    
  }

}
