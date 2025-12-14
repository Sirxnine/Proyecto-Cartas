export interface Carta {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
  tipo: string;
  rareza: string;
  poder: number;
  defensa: number;
  habilidadPasiva: string;
  habilidadUltimate: string;
}

export type NuevaCarta = Omit<Carta, 'id'>;