import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ViewChildren, Directive, QueryList } from '@angular/core';
import { Vendedor } from '../models/vendedor.model';
import { LoginService } from 'src/app/services/login.service';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PuedeDesactivar } from 'src/app/guards/can-deactive.guard';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, PuedeDesactivar, AfterViewInit {

  // @ViewChild('nameRef') nameRef: ElementRef;
  // @ViewChildren('f') forma: QueryList<any>;

  vendedor: Vendedor;
  form: NgForm;
  formularioListo: boolean = false;
  imgTemp: any;
  bImg: boolean = false;
  constructor(private _vendedorService:VendedorService,
              private activateRoute: ActivatedRoute,
              private _loginService: LoginService,
              private router: Router) {
                this.activateRoute.params.subscribe( async resp => {
                  this.getPerfilCompleto(  resp['id']);
                })
  }
  ngAfterViewInit(): void {
  }
  
  ngOnInit(): void {
    // console.log(this.form);
  }
  
  getPerfilCompleto(id:string){
    this._vendedorService.getVendedor(id).subscribe( async (resp:any) => {
      if(  resp.img ){
        this.bImg = true;
      }
      this.vendedor = resp;
      
      if(resp.ciudad && resp.telefono){
        this.formularioListo = true
      }
    })
  }
  
  actualizar(f: NgForm){
    
    let newVendedor: Vendedor = {
      ciudad : this.vendedor.ciudad,
      email: this.vendedor.email,
      nombre: this.vendedor.nombre,
      telefono: this.vendedor.telefono,
      _id: localStorage.getItem('id')
    }
    
    this._vendedorService.updateVendedor(newVendedor).subscribe( async resp => {
      
      
      this._loginService.img.emit(   resp.img);
      if(this.bImg === false){
        this.updateImagen(  resp._id, 'vendedores', this.vendedor.img );
      }

      Swal.fire('Actualizado', `${resp.nombre}`, 'info');
      
      this.router.navigate(['/anuncios', 'nav']);
    })
    
  }
  
  updateImagen(id: string, tipo:string, imagen:any){
    this._vendedorService.updateImage( id, tipo, imagen)
    .subscribe( async (anuncio:any) => {
      this._loginService.img.emit(   anuncio.img);
    });
  }

  cambiosForm(formulario: NgForm){
    this.form = formulario;
    if(formulario.valid){
        formulario.ngSubmit.subscribe(() => {
          this.formularioListo = true
        })
    }
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

  permitirSalirDeRuta(): boolean | import('rxjs').Observable<boolean> | Promise<boolean>{
    if(this.formularioListo){
      return true
    }

      Swal.fire('No puede salir', 'los datos son necesarios para contactarte. Asegurate de dar click en ACTUALIZAR', 'warning');
      return false
    


  }
  
}
