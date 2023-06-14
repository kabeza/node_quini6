import * as cheerio from 'cheerio';

export interface Sorteo {
  numero: string,
  titulo: string,
  fecha: string,
  link: cheerio.Element | string | undefined,
}
