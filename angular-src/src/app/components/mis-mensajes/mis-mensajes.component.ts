import { Component, OnInit, OnDestroy } from "@angular/core";
import { AnunciosService } from "src/app/services/anuncios.service";
import { ActivatedRoute } from "@angular/router";
import { VendedorService } from "src/app/services/vendedor.service";
import { Vendedor } from "../models/vendedor.model";
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: "app-mis-mensajes",
  templateUrl: "./mis-mensajes.component.html",
  styleUrls: ["./mis-mensajes.component.css"],
})
export class MisMensajesComponent implements OnInit, OnDestroy {

  mensaje: any;
  vendedor: Vendedor;
  mensajesEmit: any[] = [];

  btnEnviar = false;
  mensajeAEnviar: string = "";
  elemento: HTMLElement;

  mensajesSubscription: Subscription;

  vendedorMensaje: Vendedor;

  constructor(
    private _anuncioService: AnunciosService,
    private activateRoute: ActivatedRoute,
    private _vendedorServic: VendedorService,
    private chatService:ChatService
  ) {}



  ngOnInit(): void {
    this.getVendedor();
    this.getMensajeActual();

    this.mensajesSubscription = this.chatService.getNotificaciones().subscribe( (msg:any) => {
      this.mensajesEmit.push(msg);
      // console.log(msg);
      this.scroll();

    })
  }

  getVendedor() {
    this._vendedorServic
      .getVendedor(localStorage.getItem("id"))
      .subscribe((vendedor) => {
        this.vendedorMensaje = vendedor;
      });
  }

  getMensajeActual(){
      this.activateRoute.params.subscribe((idMensaje) => {
        this._anuncioService.getMensaje(idMensaje["id"]).subscribe((resp:any) => {

          this.mensaje = resp;
          this.mensajesEmit = [...this.mensaje.mensaje];
          this.anuncioVendedor();

        });
      });
  }

  anuncioVendedor() {
    this._vendedorServic
      .getVendedor(this.mensaje.anuncio.vendedor)
      .subscribe((resp) => {
        this.vendedor = resp;
        this.scroll();
      });
  }

  responderMensaje(id: string) {

    if(this.mensajeAEnviar.trim().length === 0){
      return;
    }

    let newMensaje = {
      mensaje: this.mensajeAEnviar,
      usuario: this.vendedorMensaje,
      id_mensaje: id,
      leidoPor: localStorage.getItem('id'),
    };


    // this.chatService.sendMessage(newMensaje)
    this.chatService.sendNotificacion(newMensaje);

    this._anuncioService.updateMensaje(id, newMensaje).subscribe((respMen) => {
      this.mensajeAEnviar = '';
    });

  }

  ngOnDestroy(): void {
    this.mensajesSubscription.unsubscribe();
  }

  scroll () {
    this.elemento = document.getElementById('chat-mensajes');

    setTimeout(()=> {
      this.elemento.scrollTop = this.elemento.scrollHeight;
    },10 )

  }


}
