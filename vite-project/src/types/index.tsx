export interface Carta {
  id: number;
  nombre: string;
  poder: number;
  defensa: number;
  hp: number;
  descripcion: string;
  imagen: string;
  tipo: string; // Cambiado: ahora está directamente en Carta
  habilidadUltimate: string; // Cambiado: ahora está directamente en Carta
  anime?: string; // Opcional para las cartas de ejemplo
}
export type NuevaCarta = Omit<Carta, 'id'>;

export interface HeaderProps {
  busqueda: string;
  setBusqueda: (valor: string) => void;
}

export interface CartaProps {
  carta: Carta;
  onClick: (carta: Carta) => void;
  onEliminar: (id: number) => void;
}

export interface ListaCartasProps {
  cartas: Carta[];
  onCartaClick: (carta: Carta) => void;
  onEliminarCarta: (id: number) => void;
  onAñadirCarta: (carta: Carta) => void;
}

export interface ModalCartaProps {
  carta: Carta | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface IApiCard {
  idCard: string;
  name: string;
  description: string;
  attack: number;
  defense: number;
  lifePoints: number;
  pictureUrl: string;
  attributes: {
    tipo?: string;
    habilidadUltimate?: string;
    anime?: string;
  };
  userSecret: string;
  createdAt: string;
  updatedAt: null | string;
}

export const toApiCardMapper = (carta: Carta) => {
  return {
    name: carta.nombre,
    description: carta.descripcion,
    pictureUrl: carta.imagen || "https://via.placeholder.com/150",
    lifePoints: Number(carta.hp),
    attack: Number(carta.poder),
    defense: Number(carta.defensa),
    attributes: {
      tipo: carta.tipo || "Luchador",
      habilidadUltimate: carta.habilidadUltimate || ""
    }
  };
};

export const toCardApiMapper = (apiCard: IApiCard): Carta => ({
  id: parseInt(apiCard.idCard),
  nombre: apiCard.name,
  descripcion: apiCard.description,
  poder: apiCard.attack,
  defensa: apiCard.defense,
  hp: apiCard.lifePoints,
  imagen: apiCard.pictureUrl,
  tipo: apiCard.attributes?.tipo || 'Luchador',
  habilidadUltimate: apiCard.attributes?.habilidadUltimate || ''
});