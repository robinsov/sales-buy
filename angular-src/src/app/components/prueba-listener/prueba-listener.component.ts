import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-prueba-listener',
  templateUrl: './prueba-listener.component.html',
  styleUrls: ['./prueba-listener.component.css']
})
export class PruebaListenerComponent implements OnInit {

  @Input('boton') source: string;

  
  @Output() cargarImages = new EventEmitter<any>();
  @Output() permiteCarga = new EventEmitter<any>();

  estaSobreDropZone: boolean = false;
  permiteCargar: boolean = true;
  filesToUpload: any;

  archivos: any[] = [];
  constructor() { 

  }

  ngOnInit(): void {
    
  }

  archivoSobreDropZone(e: any) {
    this.estaSobreDropZone = e;
  }

  fileChangeEvent(fileInput: any) {
      this.filesToUpload = <File>fileInput.target.files;
      console.log(this.filesToUpload);
  }

  limpiarArchivos() {
    this.archivos = [];
    
    this.permiteCargar = true;
  }

  cargarImagenes(){
    this.cargarImages.emit(this.archivos);
    this.permiteCarga.emit(this.permiteCargar);
  }

}
