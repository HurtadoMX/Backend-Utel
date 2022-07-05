const server = require('./src/app/app.js');

 server.listen(3001, () => {
    console.log('corriendo en el puerto 3001');
    console.log("Conectado a la Mercadolibre");
  });