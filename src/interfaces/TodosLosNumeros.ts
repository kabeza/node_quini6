
export interface TodosLosNumeros {
  tiposorteo: Tiposorteo[];
}

export interface Tiposorteo {
  titulo: string;
  numeros: Numero[];
}

export interface Numero {
  numero: string;
  fecha: string;
  numeros: string;
}
