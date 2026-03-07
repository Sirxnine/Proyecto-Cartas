import { RiCloseLine, RiSwordLine, RiShieldLine, RiHeartPulseLine } from "react-icons/ri";
import type { Carta as CartaType } from '../types';

interface CartaProps {
  carta: CartaType;
  onClick: (carta: CartaType) => void;
  onEliminar: (id: number) => void;
}

function Carta({ carta, onClick, onEliminar }: CartaProps) {
  const puntosVida = carta.hp || 0;

  return (
    <div className="group relative w-full aspect-[1/1.4]">
      <button onClick={(e) => { e.stopPropagation(); onEliminar(carta.id); }} 
              className="absolute -top-2 -right-2 z-40 p-1.5 bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
        <RiCloseLine size={18} />
      </button>

      <button onClick={() => onClick(carta)} className="relative h-full w-full rounded-[2.5rem] p-1 bg-[#121212] border border-white/10 overflow-hidden group-hover:scale-[1.02] transition-all duration-500">
        <div className="relative h-full w-full rounded-[2.2rem] overflow-hidden bg-black">
          <img src={carta.imagen} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt={carta.nombre} />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/60" />

          {/* HEADER: Nombre y HP */}
          <div className="absolute top-4 left-4 right-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="bg-white px-3 py-0.5 -skew-x-12">
                <span className="text-[10px] font-black text-black uppercase">{carta.nombre}</span>
              </div>
              {/* ESTO MOSTRARÁ EL HP */}
              <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded border border-green-500/50">
                <RiHeartPulseLine className="text-green-400 text-[10px]" />
                <span className="text-[10px] font-black text-white">{puntosVida}</span>
              </div>
            </div>
          </div>

          {/* FOOTER: Atk y Def */}
          <div className="absolute bottom-5 left-4 right-4 flex gap-2">
            <div className="flex-1 flex justify-between items-center bg-red-900/40 border-l-2 border-red-500 px-2 py-1 rounded-r-lg">
              <RiSwordLine className="text-red-500 text-[10px]" />
              <span className="text-xs font-black text-white">{carta.poder}</span>
            </div>
            <div className="flex-1 flex justify-between items-center bg-blue-900/40 border-l-2 border-blue-500 px-2 py-1 rounded-r-lg">
              <RiShieldLine className="text-blue-500 text-[10px]" />
              <span className="text-xs font-black text-white">{carta.defensa}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default Carta;