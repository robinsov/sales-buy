import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private http: HttpClient) { }

  getCategorias(){
    return this.http.get(`${environment.API_URI}/categoria`).pipe( map ((resp:any) => {
      return resp.categorias;
    }));
  }
}
