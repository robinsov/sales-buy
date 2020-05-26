import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Vendedor } from '../models/vendedor.model';
import { LoginService } from 'src/app/services/login.service';
import { VendedorService } from 'src/app/services/vendedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PuedeDesactivar } from 'src/app/guards/can-deactive.guard';
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, AfterViewInit, PuedeDesactivar {

  @ViewChild('f', {static: false}) f: ElementRef;

  result: Vendedor;
  form: NgForm;
  formularioListo: boolean = false;
  imgTemp: any;
  bImg: boolean = false;
  imagen: string;
  ImagenASubir: any;
  fechaSubs: Date;

  get nombre(){
    return this.formulario.get('nombre');
  }
  get email(){
    return this.formulario.get('email');
  }
  get telefono(){
    return this.formulario.get('telefono');
  }
  get img(){
    return this.formulario.get('img');
  }
  get ciudad(){
    return this.formulario.get('ciudad');
  }

  
  constructor(private _vendedorService:VendedorService,
    private activateRoute: ActivatedRoute,
    private _loginService: LoginService,
    private router: Router,
    private formBuilder :FormBuilder) {
      
    }

    ngAfterViewInit(): void {
      console.log(this.f);
    
  }

    formulario = this.formBuilder.group({
      nombre: [{value: '', disabled: false} , {
        validators: [Validators.required, Validators.minLength(3)]
      }],
      email: [{value: '', disabled: true} , {
        validators: [Validators.required, Validators.email]
      }],
      telefono:[{value: '', disabled: false} , {
        validators: [Validators.required, Validators.min(1000000000), Validators.maxLength(999999999) ]
      }],
      ciudad: [{value: '', disabled: false} , {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15)]
      }],
      img: [{value: '', disabled: false} , {
        validators: [Validators.required ]
      }]
    })

  ngOnInit(): void {

   
    console.log(this.formulario);
    this.activateRoute.params.subscribe(  resp => {
      this.getPerfilCompleto( resp['id']);
    })
  }
  
  getPerfilCompleto(id:string){
    this._vendedorService.getVendedor(id).subscribe(async (resp:any) => {
      this.result = await resp;

      this.email.patchValue(this.result.email);
      this.nombre.patchValue(this.result.nombre); 
      this.fechaSubs = this.result.fechaSubs;

      if( (this.result.ciudad && this.result.telefono && this.result.img)){
        this.formularioListo = true
        this.telefono.patchValue(this.result.telefono);
        this.ciudad.patchValue(this.result.ciudad);
      }
      
      if(  this.result.img ){
        this.bImg = true;
        this.imagen = this.result.img;
        this.img.patchValue({img: this.result.img})
        this._loginService.img.emit(this.result.img);
      }
      
    })
  }
  
  actualizar(){
    
    let newVendedor: Vendedor = {
      ciudad : this.ciudad.value,
      email: this.email.value,
      nombre: this.nombre.value,
      telefono: this.telefono.value,
      _id: localStorage.getItem('id')
    }
    
    this._vendedorService.updateVendedor(newVendedor).subscribe( async resp => {
   
      let result: Vendedor;
      if(this.bImg === false){
        result = await this.updateImagen(resp._id, 'vendedores', this.ImagenASubir);
      }
      
      if(result){
        this._loginService.img.emit(result['img']);
        this.formularioListo = true
      }

      this._loginService.nombre.emit( resp.nombre);
      await Swal.fire('Actualizado', `${resp.nombre}`, 'info');
      await this.router.navigate(['/anuncios', 'nav']);

      
    })
    
  }
  
  updateImagen(id: string, tipo:string, imagen:any){

    return new Promise( (resolve, reject)=> {

      this._vendedorService.updateImage( id, tipo, imagen)
      .subscribe( (anuncio:Vendedor) => {
        resolve(anuncio);
      });
    } )
    

  }

  
  processFile(imageInput){
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    
    reader.addEventListener('load', (event: any) => {
      
      this.ImagenASubir = file;
      this.img.patchValue({img: ''})
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
