# Sorteos del Quini6
Server en NodeJS que utiliza Cheerio para obtener los datos de resultados de los sorteos del Quini 6 (Lotería de Argentina)

_Aplicación desarrollada con_
- NodeJS
- Express
- Cheerio
- Axios

## Endpoints

Una vez deployada en la url definitiva (recordar que es un server Node/Express) , los endpoints son:

## Obtenidos del sitio Quini 6 Resultados ##

- [URL_SERVER]/opc1/sorteos
Obtiene la lista de todos los sorteos
De aqui se puede obtener el numero especifico de sorteo y luego llamar a este segundo endpoint para obtener los resultados de ese sorteo específico

- [URL_SERVER]/opc1/resultados/:sorteoNro
Obtiene los resultados de el sorteo dado por "sorteoNro"
Tradicional
Segunda
Revancha
Siempre Sale
Pozo Extra

## Obtenidos del sitio Tu Jugada ##

* Work in progress *

# TODO

- Agregar auth, seguridad
- Optimizar código
- etc.
