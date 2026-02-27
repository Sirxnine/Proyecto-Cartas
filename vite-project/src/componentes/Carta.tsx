import type { CartaProps } from '../types/index';
import { BsFeather } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";

function Carta({ carta, onClick, onEliminar }: CartaProps & { onEliminar: (id: number) => void }) {
  // Logica de datos
  const psValue = Math.floor(carta.defensa / 10);
  const damageValue = Math.floor(carta.poder / 50);

 return (
    <div className="group relative w-full aspect-[1/1.4]">
      
      {/* BOTÓN DE BORRADO */}
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onEliminar(carta.id);
        }}
        className="absolute -top-2 -right-2 z-30 p-1.5 bg-red-600 text-white rounded-full 
                   shadow-[0_0_15px_rgba(220,38,38,0.5)] border-2 border-[#1a1a1a]
                   opacity-0 group-hover:opacity-100 transition-all duration-300 
                   hover:scale-110 hover:bg-red-500 active:scale-90"
      >
        <RiCloseLine size={18} />
      </button>
    <button
      onClick={() => onClick(carta)}
      className="group relative w-full aspect-[1/1.4] rounded-3xl p-1 bg-[#1a1a1a] border border-white/10 
        cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
        focus:outline-none focus:ring-2 focus:ring-cyan-500 overflow-hidden"
    >
      {/* Contenedor de la Imagen */}
      <div className="relative h-full w-full rounded-[1.2rem] overflow-hidden">
        <img
          src={carta.imagen}
          alt={carta.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://preview.redd.it/characters-that-can-be-recognized-with-just-their-silhouette-v0-ytm08da795qc1.jpg?width=374&format=pjpg&auto=webp&s=854ae5998b018e53a292ef0adc1f5716d89777f8';
          }}
        />
          {/* Efecto de sombreado para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 group-hover:via-black/10 transition-all" />

        {/* Header de la Carta */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-sm -skew-x-12 shadow-lg border-b border-gray-400">
            <h3 className="text-[10px] font-black text-black italic uppercase leading-none tracking-tighter">
              {carta.nombre} <span className="text-xs not-italic">ML</span>
            </h3>
          </div>
          <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20">
            <span className="text-[8px] font-bold text-white/70">PS</span>
            <span className="text-xs font-black text-white">{psValue}</span>
          </div>
        </div>

        {/* Marca de Pluma*/}
          <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 backdrop-blur-md rounded-bl-2xl border-l border-b border-white/20 flex items-center justify-center pointer-events-none">
            <BsFeather className="text-[15px] font-serif text-white/80 font-bold" />
          </div>

        {/* Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-cyan-400 italic uppercase tracking-widest drop-shadow-md mb-1">
                {carta.tipo}
              </span>
              <div className="flex gap-1">
                <div className="w-3.5 h-3.5 bg-orange-700 rounded-full border border-black shadow-sm" />
                <div className="w-3.5 h-3.5 bg-gray-400 rounded-full border border-black shadow-sm" />
              </div>
            </div>
            
            {/* Valor de Poder (Ataque) */}
            <div className="flex flex-col items-end">
                <span className="text-2xl font-black text-white italic drop-shadow-md leading-none">
                  {damageValue}
                </span>
            </div>
          </div>
        </div>

        {/* Efecto de Brillo 'Holográfico' al pasar el mouse */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-linear-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </button>
    </div>
  );

}

export default Carta;