import { Component, OnInit, Input, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, Renderer2, HostListener, NgZone } from "@angular/core";
import { AnunciosService } from "src/app/services/anuncios.service";
import { ActivatedRoute } from "@angular/router";
import { VendedorService } from "src/app/services/vendedor.service";
import { Vendedor } from "../models/vendedor.model";
import { map, take } from 'rxjs/operators';
import { Socket } from "ngx-socket-io";

@Component({
  selector: "app-mis-mensajes",
  templateUrl: "./mis-mensajes.component.html",
  styleUrls: ["./mis-mensajes.component.css"],
})
export class MisMensajesComponent implements OnInit {

  @ViewChild('caja', {static: false}) caja : ElementRef;
  @ViewChild('end', {static: false}) end : ElementRef;

  mensaje: any;
  vendedor: Vendedor;

  mensajes: any[] = [];

  btnEnviar = false;
  mensajeAEnviar: string = "";

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
      this._anuncioService.getMensaje(idMensaje["id"]).subscribe((resp:any) => {
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
      leido: false,
    };

    this.socket.emit('message', {
      data: newMensaje,
      idMensaje: id
    });    

    this._anuncioService.updateMensaje(id, newMensaje).subscribe((respMen) => {
      this.mensajeAEnviar = '';

      if(respMen){
        this.socket.fromEvent('message').pipe(
          map( data => data)
        ).subscribe((resp:any) => {
          this.getMensajeActual();
          if(resp.data.usuario._id === localStorage.getItem('id')){
            this._anuncioService.mensajesNuevos.emit(false);
          }else {
            this._anuncioService.mensajesNuevos.emit(true);
          }
          this.irAlFinal();
        });
      }
    });

  }

  irAlFinal(){
    this.end.nativeElement.click();
  }

}
