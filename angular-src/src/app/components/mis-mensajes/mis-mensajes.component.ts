import { Component, OnInit, Input } from "@angular/core";
import { AnunciosService } from "src/app/services/anuncios.service";
import { ActivatedRoute } from "@angular/router";
import { VendedorService } from "src/app/services/vendedor.service";
import { Vendedor } from "../models/vendedor.model";
import { map } from 'rxjs/operators';
import { Socket } from "ngx-socket-io";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-mis-mensajes",
  templateUrl: "./mis-mensajes.component.html",
  styleUrls: ["./mis-mensajes.component.css"],
})
export class MisMensajesComponent implements OnInit {
  
  mensaje: any;
  vendedor: Vendedor;

  mensajes: any[] = [];

  btnResponder = false;
  btnEnviar = false;
  mensajeAEnviar: string = "";
  btnContestado = false;

  vendedorMensaje: Vendedor;

  constructor(
    private _anuncioService: AnunciosService,
    private activateRoute: ActivatedRoute,
    private _vendedorServic: VendedorService,
    private socket: Socket
  ) {}

  ngOnInit(): void {
    this.getVendedor();
    this.getMensajeActual();
  }

 

  getVendedor() {
    this._vendedorServic
      .getVendedor(localStorage.getItem("id"))
      .subscribe((vendedor) => {
        this.vendedorMensaje = vendedor;
      });
  }

  getMensajeActual() {
    this.activateRoute.params.subscribe((idMensaje) => {
      this._anuncioService.getMensaje(idMensaje["id"]).subscribe((resp) => {
        // console.log(resp);
        if (resp) {
          this.mensaje = resp;
          this.anuncioVendedor();
        }
      });
    });
  }

  anuncioVendedor() {
    this._vendedorServic
      .getVendedor(this.mensaje.anuncio.vendedor)
      .subscribe((resp) => {
        this.vendedor = resp;
      });
  }

  responderMensaje(id: string) {
    let newMensaje = {
      mensaje: this.mensajeAEnviar,
      usuario: this.vendedorMensaje,
    };


    this._anuncioService.updateMensaje(id, newMensaje).subscribe((resp) => {
      this.btnContestado = true;
      this.btnResponder = false;
      this.mensajeAEnviar = "";
      this.socket.emit('message', newMensaje.mensaje);
      if (resp) {
        this.socket.fromEvent('message').pipe(
          map( data => data )
        ).subscribe(resp => {
          if(resp){
            this.getMensajeActual();
          }
        });
      }
    });
  }
}
