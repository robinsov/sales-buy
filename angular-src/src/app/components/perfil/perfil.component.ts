import { Component, OnInit } from '@angular/core';
import { Vendedor } from '../models/vendedor.model';
import { LoginService } from 'src/app/services/login.service';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  vendedor: Vendedor; 

  imgTemp: any;
  bImg: boolean = false;
  constructor(private _vendedorService:VendedorService,
              private activateRoute: ActivatedRoute,
              private _loginService: LoginService,
              private router: Router) {
                this.activateRoute.params.subscribe( resp => {
                  this.getPerfilCompleto(resp['id']);
                  Swal.fire('Actualice sus datos', 'Asi todos tendran donde contactarte', 'warning');
                })
              }

  ngOnInit(): void {
  }

  getPerfilCompleto(id:string){
    this._vendedorService.getVendedor(id).subscribe( (resp:any) => {
      if(resp.idImg){
        this.bImg = true;
      }
      this.vendedor = resp;
      console.log(resp);
    })
  }

  actualizar(){

    let newVendedor: Vendedor = {
      ciudad : this.vendedor.ciudad,
      email: this.vendedor.email,
      nombre: this.vendedor.nombre,
      telefono: this.vendedor.telefono,
      _id: localStorage.getItem('id')
    }

    this._vendedorService.updateVendedor(newVendedor).subscribe( async resp => {
      console.log(resp);
      this._loginService.img.emit( await resp.img);
      if(this.bImg === false){
        this.updateImagen( await resp._id, 'vendedores', this.vendedor.img );
      }

       this.router.navigate(['/anuncios', 'nav']);
    })

  }

  updateImagen(id: string, tipo:string, imagen:any){
    this._vendedorService.updateImage( id, tipo, imagen)
        .subscribe( async (anuncio:any) => {
          console.log(anuncio);
          this._loginService.img.emit( await anuncio.img);
        });
  }

  processFile(imageInput){
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.vendedor.img = file;
      this.imgTemp = reader.result as string;
      
    });

    reader.readAsDataURL(file);
  }

}
