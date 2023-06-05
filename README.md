# Sorteos del Quini 6
Server en NodeJS que utiliza Cheerio para obtener los datos de resultados de los sorteos del Quini 6 (Lotería de Argentina)

_Aplicación desarrollada con_
- NodeJS
- Express
- Cheerio
- Axios

## Implementacion / Endpoints

Una vez deployada en la url definitiva (recordar que es un server Node/Express) , los endpoints son:

## Para obtener resultados del sitio Quini 6 Resultados ##

- https://URL_DEPLOY/v1/q6r/sorteos

Obtiene la lista de todos los sorteos
De aqui se puede obtener el numero especifico de sorteo y luego llamar a este segundo endpoint para obtener los resultados de ese sorteo específico

- https://URL_DEPLOY/v1/q6r/sorteo/:sorteoNro

Obtiene los resultados de el sorteo dado por "sorteoNro"
Tradicional  
Segunda  
Revancha  
Siempre Sale  
Pozo Extra  

## Para obtener resultados del sitio Tu Jugada ##

- https://URL_DEPLOY/v1/tuju/sorteos

Obtiene la lista de todos los sorteos
De aqui se puede obtener el numero especifico de sorteo y luego llamar a este segundo endpoint para obtener los resultados de ese sorteo específico

- https://URL_DEPLOY/v1/tuju/sorteo/:sorteoNro  

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
