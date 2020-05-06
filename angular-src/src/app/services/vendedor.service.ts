import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Vendedor } from '../components/models/vendedor.model';


@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  constructor(private http: HttpClient) {}


  getVendedor(id: string){
    return this.http.get(`${environment.API_URI}/vendedor/${id}`).pipe( map( (resp:any) => {
      return resp.vendedorBD;
    }));
  }


  updateVendedor(vendedor: Vendedor){
    return this.http.put(`${environment.API_URI}/vendedor/${vendedor._id}`, vendedor )
    .pipe( map ((resp:any) => {
      return resp.vendedorBD;
    }))
  }

  updateImage(id:string, tipo:string, imagen: File ){

    const formData = new FormData();
    formData.append('archivo', imagen, imagen.name);

    return this.http.put(`${environment.API_URI}/upload/${tipo}/${id}`, formData )
    .pipe( map ( (resp:any)=> {
      console.log(resp);
      return resp.resp 
    }))
  }


}

