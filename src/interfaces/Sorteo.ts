import * as cheerio from 'cheerio';

interface Resultado {
  titulo: string,
  numeros: string,
  premios: {
    aciertos: string,
    ganadores: string,
    premio: string,
  }
}
export interface ResultadoSorteo {
  infoSorteo: {
    numero: string,
    titulo: string,
    fecha: string,
    link: string,
  },
  resultados: Resultado[]
}

export interface Sorteo {
  sorteo: {
    numero: string,
    titulo: string,
    fecha: string,
    link: cheerio.Element | string | undefined
  }
}
