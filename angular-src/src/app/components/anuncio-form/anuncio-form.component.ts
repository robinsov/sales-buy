import { Component, OnInit } from "@angular/core";
import { CategoriasService } from "src/app/services/categorias.service";
import { Anuncio } from "../models/anuncio.model";
import { AnunciosService } from "src/app/services/anuncios.service";

import Swal from "sweetalert2";


import { Router, ActivatedRoute } from "@angular/router";
import { IImage } from "../models/image.model";

@Component({
  selector: "app-anuncio-form",
  templateUrl: "./anuncio-form.component.html",
  styleUrls: ["./anuncio-form.component.css"],
})
export class AnuncioFormComponent implements OnInit {
  categorias: any[] = [];
  imagenesCargadas = 0;
  permiteCargar: boolean = false;
  archivos: any[] = [];
  archivosEdit: any[] = [];
  archivoDB: IImage;

  tituloAnuncio: string;
  precioUni: number;
  descripcion: string;
  ciudad: string;
  img: any;
  categoria: string;
  vendedor: string;
  idVendedor:string;
  email: string;
  fecha: any;
  token: string;

  imgTemp: string;
  source: string;
  beditar: boolean = false;
  constructor(
    private _categoriaService: CategoriasService,
    private _anuncioServicio: AnunciosService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.cargarStorage();

    this.activatedRoute.params.subscribe(async (resp) => {
      this.source = await resp["source"];
      if (resp["source"] != "add") {
        this.beditar = true;
        this.getAnuncio(resp["source"]);
      }
    });
  }

  cargarStorage() {
    
      this.idVendedor = localStorage.getItem('id');
      this.vendedor = localStorage.getItem("vendedor");
      this.email = localStorage.getItem("email");
      this.token = localStorage.getItem("token");
      this.fecha = new Date().getTime();
      
    
  }

  ngOnInit(): void {
    this.cargarStorage();
    this._categoriaService.getCategorias().subscribe((resp) => {
      this.categorias = resp;
    });
  }

  getAnuncio(id: string) {
    this._anuncioServicio.getAnuncio(id).subscribe((resp: any) => {
      this.tituloAnuncio = resp.anuncioBD.tituloAnuncio;
      this.precioUni = resp.anuncioBD.precioUni;
      this.descripcion = resp.anuncioBD.descripcion;
      this.ciudad = resp.anuncioBD.ciudad;
      this.imgTemp = resp.anuncioBD.img;
      this.categoria = resp.anuncioBD.categoria._id;
    });

    this._anuncioServicio.getImages(this.source).subscribe( resp => {
      this.archivosEdit = resp;
    })
  }

  borrarImage(id: string){
    Swal.fire({
      title: "Estas seguro?",
      text: "No puedes recuperarla!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Borralo!",
    }).then((result) => {
      if (result.value) {
        this._anuncioServicio.deleteImage(id).subscribe( async resp => {
          this.getAnuncio(this.source);
          Swal.fire(
            "Imagen Borrada!",
            "success"
          );
        });
      }
    });

  }

  processFile(imageInput) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", (event: any) => {
      this.img = file;
      this.imgTemp = reader.result as string;
    });
    reader.readAsDataURL(file);
  }

  

  guardarAnuncio(event: any) {
    this.cargarStorage();

    let anuncio: Anuncio = {
      tituloAnuncio: this.tituloAnuncio,
      precioUni: this.precioUni,
      descripcion: this.descripcion,
      ciudad: this.ciudad,
      categoria: this.categoria,
      vendedor: localStorage.getItem('id'),
    };

    console.log('anuncio a guardar', anuncio);
    this.archivos = event;

    if (this.source === "add") {
      this._anuncioServicio.createAnuncio(anuncio, this.token).subscribe(async (resp:any) => {
        

        while (this.imagenesCargadas < this.archivos.length) {
          
          this.cargarImagen(resp._id, 'anuncios', this.archivos[this.imagenesCargadas] );

          this.imagenesCargadas++;
          
        }  
          
        this.imagenesCargadas = 0;

        await Swal.fire(
            "Anuncio Guardado!",
            `${resp.tituloAnuncio}`,
            "success"
        );
        
        await this.router.navigate(["/anuncios", "nav"]);

      });

    } else {
      
      this._anuncioServicio.updateAnuncio(anuncio, this.source).subscribe(async (resp:any) => {
        this.permiteCargar = false;

        while (this.imagenesCargadas < this.archivos.length) {
          
          this.cargarImagen(resp._id, 'anuncios', this.archivos[this.imagenesCargadas] );

          this.imagenesCargadas++;
          
        }  
          
        this.imagenesCargadas = 0;

        await Swal.fire(
            "Anuncio Actualizado!",
            `${resp.tituloAnuncio}`,
            "success"
        );
        
        await this.router.navigate(["/anuncios", "nav"]);
      });
    }
  }

  cargarImagen(id:string, tipo:string, imagen: any) {
    this._anuncioServicio.uploadImage(id, tipo, imagen).subscribe();
  }

}
