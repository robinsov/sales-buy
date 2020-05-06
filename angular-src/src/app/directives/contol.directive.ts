import { Directive, Input, Output, ElementRef, EventEmitter, HostListener } from '@angular/core';


@Directive({
  selector: '[appContol]'
})
export class ContolDirective {

  @Input() archivos: any[] = [];
  @Output() archivoSobre: EventEmitter<any> = new EventEmitter();
  constructor(public elemento: ElementRef) { }

  //inicia el arrastre
  @HostListener('dragenter', ['$event'])
  public onDragEnter(event: any) {
    console.log('inicia el proceso de arrastre');
    this.archivoSobre.emit(true);
  }
  //entra sobre en el lugar
  @HostListener('dragover', ['$event'])
  public onDragover(event: any) {
    console.log('sobre el lugar');
    let transferencia = this._getTransferencia(event);
    transferencia.dropEffect = 'copy'
    this._prevenirYDetener(event);
    this.archivoSobre.emit(true);
  }
  
  //se coloca sobre el lugar
  @HostListener('drop', ['$event'])
  public onDrop(event: any) {
    console.log('se coloca' ,event)
    let transferencia = this._getTransferencia(event);
    

    if (!transferencia) return;

    //si esta ek data transfer agrega los archivos
    this._agregarArchivos(transferencia.files)
    this.archivoSobre.emit(false)
    this._prevenirYDetener(event);
  }

  //sale del lugar
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any) {
    this.archivoSobre.emit(false);
  }


  //retorna un datrtransfer evento si es que viene de lo contrario retorna el evento original
  private _getTransferencia(event: any) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _prevenirYDetener(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  private _agregarArchivos(archivosLista: FileList) {
    for (let propiedad in Object.getOwnPropertyNames(archivosLista)) {
      let archTemporal = archivosLista[propiedad];
      if (this._archivoPuedeSercargado(archTemporal)) {
        this.archivos.push(archTemporal);
        
      }
    }
    console.log(this.archivos)
  }
  private _archivoYaFueDropeado(nombreArchivo: string): boolean {
    for (let i in this.archivos) {
      let arch = this.archivos[i];
      if (arch.name === nombreArchivo) {
        
        return true
      }
    }
    return false;
  }

  private _esImagen(tipoArchivo: string): boolean {
    return (tipoArchivo == '' || tipoArchivo == undefined) ? false : tipoArchivo.startsWith('image');
  }


  private _archivoPuedeSercargado(archivo: File): boolean {
    if (!this._archivoYaFueDropeado(archivo.name) && this._esImagen(archivo.type)) {
      return true;
    }
    return false;
  }

}
