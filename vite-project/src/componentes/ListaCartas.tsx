import type { ListaCartasProps } from '../types/index';
import Carta from './Carta';

function ListaCartas({ cartas, onCartaClick, onEliminarCarta}: ListaCartasProps) {
  if (cartas.length === 0) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {cartas.map((carta) => (
        <Carta
          key={carta.id}
          carta={carta}
          onClick={onCartaClick}
          onEliminar={onEliminarCarta}
        />
      ))}
    </div>
  );
}

export default ListaCartas;