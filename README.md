# Sorteos del Quini 6
Server en NodeJS que utiliza Cheerio para obtener los datos de resultados de los sorteos del Quini 6 (Lotería de Argentina)

_Aplicación desarrollada con_
- NodeJS
- Express
- TypeScript
- Cheerio
- Axios

## Como bajar / ejecutar
- en una carpeta vacía ejecutar `git clone https://github.com/kabeza/node_quini6.git ./ `
- luego `yarn install` o `npm install` segun el manejador de paquetes que tengas
- para ejecutar el server en testing: `npm run dev`
- para ejecutar en prod: `npm run start`

## Deploy / Implementar en Server

- ejecutar: `npm run build`
- se va a crear la carpeta `dist` con todo el codigo TypeScript convertido a JavaScript
- ejecutar: `node dist/index.js`

## NOTA! _Por defecto el server corre con el puerto 5000_ 
Si se desea cambiar, crear un archivo .env en la raiz del proyecto y colocar una variable `PORT=3000`


La API se puede deployar a Heroku/Render.com/etc. gratuitamente
Los pasos varían segun plataforma (ver docs de cada plataforma)

Una vez deployada en la url definitiva (recordar que es un server Node/Express), los endpoints son:

## Para obtener resultados del sitio Quini 6 Resultados ##

- **`https://URL_DEPLOY/v1/q6r/sorteos`**

Obtiene la lista de todos los sorteos
De aqui se puede obtener el numero especifico de sorteo y luego llamar a este segundo endpoint para obtener los resultados de ese sorteo específico

- **`https://URL_DEPLOY/v1/q6r/sorteo/:sorteoNro`**

Obtiene los resultados de el sorteo dado por "sorteoNro"
Tradicional  
Segunda  
Revancha  
Siempre Sale  
Pozo Extra  

- **`https://URL_DEPLOY/v1/q6r/todoslosnumeros`**

Obtiene data de los ultimos 18-20 sorteos  
Agrupa los numeros por tipo de sorteo:
Tradicional  
Segunda  
Revancha  
Siempre Sale  
Y además saca en "raw" una propiedad con todos los números juntos, para sacar estadísticas o similar

## Para obtener resultados del sitio Tu Jugada ##

- **`https://URL_DEPLOY/v1/tuju/sorteos`**

Obtiene la lista de todos los sorteos
De aqui se puede obtener el numero especifico de sorteo y luego llamar a este segundo endpoint para obtener los resultados de ese sorteo específico

- **`https://URL_DEPLOY/v1/tuju/sorteo/:sorteoNro`**

Obtiene los resultados de el sorteo dado por "sorteoNro"
Tradicional  
Segunda  
Revancha  
Siempre Sale  
Pozo Extra  

# TODO

- Agregar auth, seguridad
- Optimizar código
- etc.
