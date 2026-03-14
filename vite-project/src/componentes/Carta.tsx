import { RiCloseLine, RiSwordLine, RiShieldLine, RiHeartPulseLine, RiLoader4Line } from "react-icons/ri";
import type { Carta as CartaType } from '../types';

interface CartaProps {
  carta: CartaType;
  onClick: (carta: CartaType) => void;
  onEliminar: (id: number) => void;
  isDeleting?: boolean;
}

function Carta({ carta, onClick, onEliminar, isDeleting }: CartaProps) {
  const puntosVida = carta.hp || 0;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDeleting) {
      onEliminar(carta.id);
    }
  };

  return (
    <div className="group relative w-full aspect-[1/1.4]">
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className={`absolute -top-2 -right-2 z-40 p-1.5 rounded-full shadow-lg transition-all ${
          isDeleting 
            ? 'bg-gray-600 cursor-not-allowed opacity-50' 
            : 'bg-red-600 hover:bg-red-500 opacity-0 group-hover:opacity-100'
        }`}
      >
        {isDeleting ? (
          <RiLoader4Line size={18} className="animate-spin" />
        ) : (
          <RiCloseLine size={18} />
        )}
      </button>

      <button 
        onClick={() => onClick(carta)} 
        disabled={isDeleting}
        className={`relative h-full w-full rounded-[2.5rem] p-1 bg-[#121212] border border-white/10 overflow-hidden transition-all duration-500 ${
          isDeleting ? 'opacity-50 cursor-not-allowed' : 'group-hover:scale-[1.02]'
        }`}
      >
        {/* ... resto del contenido igual ... */}
        <div className="relative h-full w-full rounded-[2.2rem] overflow-hidden bg-black">
          <img 
            src={carta.imagen} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100" 
            alt={carta.nombre} 
          />
          {/* ... más contenido ... */}
        </div>
      </button>
    </div>
  );
}

export default Carta;