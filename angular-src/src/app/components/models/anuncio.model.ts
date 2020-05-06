export interface Anuncio {
    _id?: string;
    tituloAnuncio?: string;
    precioUni?: number;
    descripcion?: string;
    disponible?: boolean;
    fechaAnuncio?: Date;
    ciudad?: string;
    img?: any;
    categoria?: string;
    vendedor?: string;
}