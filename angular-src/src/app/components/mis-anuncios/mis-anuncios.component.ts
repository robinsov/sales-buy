import { Component, OnInit, Host } from "@angular/core";
import { AnunciosService } from "src/app/services/anuncios.service";
import { Anuncio } from "../models/anuncio.model";
import { TarjetasAnunciosComponent } from "../tarjetas-anuncios/tarjetas-anuncios.component";
import Swal from "sweetalert2";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-mis-anuncios",
  templateUrl: "./mis-anuncios.component.html",
  styleUrls: ["./mis-anuncios.component.css"],
})
export class MisAnunciosComponent implements OnInit {
  misAnuncios: any[] = [];
  idVendedor = localStorage.getItem("id");
  source: string;
  constructor(private _anuncioService: AnunciosService,
              private activateRoute: ActivatedRoute) {
              this.activateRoute.params.subscribe(async resp=> {
                this.source =   resp['source'];
                
              })
  }

  ngOnInit(): void {
    
      this.getMisAnuncios();
    
  }

  getMisAnuncios() {
    this._anuncioService
      .getMisAnuncios(this.idVendedor)
      .subscribe( async (resp: any) => {
        this.misAnuncios =   resp.misAnuncios
      });
  }

  borrarAnuncio(id: string) {
    Swal.fire({
      title: "Estas seguro?",
      text: "No puedes recuperarlo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Borralo!",
    }).then((result) => {
      if (result.value) {
        this._anuncioService.deleteAnuncio(id).subscribe(async (resp: any) => {
          this.getMisAnuncios();
            Swal.fire(
            "Articulo Borrado!",
            `${   resp.anuncioBorradoBD.tituloAnuncio}`,
            "success"
          );
        });
      }
    });
  }
}
