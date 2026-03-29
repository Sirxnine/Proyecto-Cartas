//Importaciones necesarias
import type { ListaCartasProps } from '../types/index';
import Carta from './Carta';

//Interfaz de props para el componente de lista de cartas, con opción de loading para eliminación
interface Props extends ListaCartasProps {
  loadingDelete?: boolean;
}

// Componente para mostrar la lista de cartas, con manejo de estado de eliminación
function ListaCartas({ cartas, onCartaClick, onEliminarCarta }: Props) {
  
  // Si no hay cartas, no renderizar nada
  if (cartas.length === 0) {
    return null; 
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      
      {/* Renderizar cada carta con sus props correspondientes */}
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