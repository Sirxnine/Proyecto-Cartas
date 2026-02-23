export interface Carta {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
  tipo: string;
  rareza: string;
  poder: number;
  defensa: number;
  habilidadUltimate: string;
  anime: string; 
}

export type NuevaCarta = Omit<Carta, 'id'>;


export interface HeaderProps {
  busqueda: string;
  setBusqueda: (valor: string) => void;
}

export interface CartaProps {
  carta: Carta;
  onClick: (carta: Carta) => void;
}

export interface ListaCartasProps {
  cartas: Carta[];
  onCartaClick: (carta: Carta) => void;
}

export interface ModalCartaProps {
  carta: Carta | null;
  isOpen: boolean;
  onClose: () => void;
}

