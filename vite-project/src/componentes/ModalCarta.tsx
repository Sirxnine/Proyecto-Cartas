import { RiCloseLine, RiSwordLine, RiShieldLine, RiFocus3Line, RiEditLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import type { Carta } from "../types";

interface Props {
  carta: Carta | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModalCarta = ({ carta, isOpen, onClose }: Props) => {
  const navigate = useNavigate();

  if (!isOpen || !carta) return null;

  const handleEditClick = () => {
    onClose();
    navigate(`/Edit/${carta.id}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      
      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 z-[150] bg-red-600 hover:bg-red-500 text-white p-3 rounded-full transition-all border border-white/20 shadow-lg"
      >
        <RiCloseLine size={24} />
      </button>

      <button 
        onClick={handleEditClick}
        className="absolute top-8 left-8 z-[150] bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-full transition-all border border-black/20 shadow-lg flex items-center gap-2 font-black uppercase italic text-xs tracking-widest"
      >
        <RiEditLine size={18} /> Editar Registro
      </button>

      <div className="relative z-10 w-full max-w-[460px] aspect-[1/1.4] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col">
        
        <div className="absolute inset-0 z-0">
          <img src={carta.imagen} className="w-full h-full object-cover object-top" alt={carta.nombre} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 p-8 flex justify-between items-start">
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
            {carta.nombre} <span className="text-xl font-bold opacity-60">V</span>
          </h2>
          <div className="text-right">
            <span className="text-white/40 text-[9px] font-black block tracking-widest uppercase">Puntos Salud</span>
            <span className="text-4xl font-black text-white italic tabular-nums">{carta.hp}</span>
          </div>
        </div>

        <div className="relative z-10 mt-auto p-8 space-y-5">
          <div className="flex gap-3">
            <div className="flex-1 bg-red-600/10 backdrop-blur-md border border-red-500/30 p-3 rounded-xl flex items-center justify-between text-white">
              <RiSwordLine className="text-red-500" size={20} />
              <span className="text-xl font-black italic">{carta.poder}</span>
            </div>
            <div className="flex-1 bg-blue-600/10 backdrop-blur-md border border-blue-500/30 p-3 rounded-xl flex items-center justify-between text-white">
              <RiShieldLine className="text-blue-500" size={20} />
              <span className="text-xl font-black italic">{carta.defensa}</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/15 p-4 rounded-2xl">
            <div className="flex items-center gap-1.5 mb-1 text-yellow-400 font-black uppercase text-[9px] tracking-widest">
              <RiFocus3Line size={16} /> {carta.tipo}
            </div>
            <h3 className="text-lg font-black text-white italic uppercase leading-none mb-2">
              {carta.habilidadUltimate}
            </h3>
            <p className="text-white/70 text-[12px] italic leading-tight line-clamp-2">
              {carta.descripcion}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCarta;