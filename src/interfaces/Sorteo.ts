import * as cheerio from 'cheerio';

export interface Sorteo {
  sorteo: {
    numero: string,
    titulo: string,
    fecha: string,
    link: cheerio.Element | string | undefined
  }
}
