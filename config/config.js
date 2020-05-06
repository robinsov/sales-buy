//==============================
// puerto
//==============================

process.env.PORT = process.env.PORT || 3000;



// =======================================
//    CLOUDINARY
// =====================================
process.env.CLOUDINARY_CLOUD_NAME = 'dsifghbyk';
process.env.CLOUDINARY_APY_KEY = '826663455555642';
process.env.CLOUDINARY_APY_SECRET = 'aHfpzsAd2hw8cZwK7vMcaEk7Dyg';



//==============================
// entorno
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'prod';

//==============================
// BASE DA DATOS
//==============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/tienda';
} else {
    urlDB = process.env.MONGODB_URI;
}

//==============================
// VENCIMIENTO DEL TOKEN
//==============================
// 60 SEGUNDOS
// 60 MINUTOS
// 24 HORAS
// 30 DIAS

process.env.CADUCIDAD_TOKEN = '48h';

//==============================
// SEED O SEMILLA DE AUTENTICACION
//==============================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


process.env.URLDB = urlDB;