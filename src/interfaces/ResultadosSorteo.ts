export interface ResultadoSorteo {
  infoSorteo: InfoSorteo[];
  resultados: Resultado[];
}

export interface InfoSorteo {
  numero: string;
  titulo: string;
  fecha: string;
  link: string;
}

export interface Resultado {
  titulo: string;
  numeros: string;
  premios: Premio[];
}

export interface Premio {
  aciertos: string;
  ganadores: string;
  premio: string;
}
