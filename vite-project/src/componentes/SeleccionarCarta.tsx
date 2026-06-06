import { useState } from 'react';
import type { Carta as CartaType } from '../types/index';
import Carta from './Carta'; 
import { Link } from 'react-router';
import { RiSwordFill } from 'react-icons/ri';

type Props = {
  mazo: CartaType[];
  loading: boolean;
};

function SeleccionarCarta({ mazo, loading }: Props) {
  const [cartaSeleccionada1, setCartaSeleccionada1] = useState<CartaType | null>(null);
  const [cartaSeleccionada2, setCartaSeleccionada2] = useState<CartaType | null>(null);

  const listoBatalla = cartaSeleccionada1 !== null && cartaSeleccionada2 !== null;

  const handleSeleccionarCarta = (carta: CartaType) => {
    const isSelected1 = cartaSeleccionada1?.id === carta.id;
    const isSelected2 = cartaSeleccionada2?.id === carta.id;

    if (isSelected1) {
      setCartaSeleccionada1(null);
      return;
    }

    if (isSelected2) {
      setCartaSeleccionada2(null);
      return;
    }

    if (!cartaSeleccionada1) {
      setCartaSeleccionada1(carta);
    } else if (!cartaSeleccionada2) {
      setCartaSeleccionada2(carta);
    }
  };

  const handleIgnoreDelete = (id: number) => {
    console.log("No se pueden borrar cartas en el modo de selección. ID:", id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505] text-cyan-400 font-mono tracking-widest animate-pulse">
        CARGANDO MAZO DE BATALLA...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#050505] text-slate-100 p-6 space-y-8 selection:bg-cyan-500/30">
      
      {/* Panel Superior Informativo de Estado de Selección */}
      <div className="max-w-xl mx-auto">
        {listoBatalla ? (
          <div className="flex flex-col items-center justify-center p-4 bg-cyan-500/10 border border-cyan-500 rounded-2xl space-y-3 shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-in fade-in zoom-in duration-300">
            <div className="text-cyan-400 font-black text-lg tracking-[0.2em] uppercase flex items-center gap-2">
              <RiSwordFill className="animate-bounce" /> 
              <span>¡UNIDADES LISTAS PARA EL COMBATE!</span>
            </div>
            <p className="text-xs text-white/50 font-mono">
              {cartaSeleccionada1?.nombre} VS {cartaSeleccionada2?.nombre}
            </p>
            <Link 
              to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
              className="px-8 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-mono rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase tracking-wider"
            >
              Iniciar Simulación de Batalla ⚔️
            </Link>
          </div>
        ) : (
          /* CORREGIDO: Todo el texto dinámico y estático ahora está aislado en bloques limpios para evitar errores de DOM */
          <div className="text-center p-4 bg-white/5 border border-white/10 rounded-2xl text-white/60 font-mono text-sm">
            <p>
              Selecciona <span className="text-cyan-400 font-bold">2 cartas</span> de la colección para inicializar el combate.
            </p>
            <div className="text-xs text-white/30 mt-2 flex justify-center gap-1">
              <span>Progreso:</span>
              <span>[</span>
              <span className={cartaSeleccionada1 ? "text-cyan-400" : ""}>{cartaSeleccionada1 ? "■" : "□"}</span>
              <span className={cartaSeleccionada2 ? "text-cyan-400" : ""}>{cartaSeleccionada2 ? "■" : "□"}</span>
              <span>]</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid General del Mazo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {mazo && mazo.length > 0 ? (
          mazo.map((carta) => {
            const estaSeleccionada =
              cartaSeleccionada1?.id === carta.id || cartaSeleccionada2?.id === carta.id;

            return (
              <div
                key={carta.id}
                className={`transition-all duration-300 rounded-[2.5rem] ${
                  estaSeleccionada 
                    ? 'ring-4 ring-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-[1.03]' 
                    : 'hover:scale-[1.02] opacity-80 hover:opacity-100'
                }`}
              >
                <Carta
                  carta={carta}
                  onClick={handleSeleccionarCarta}
                  onEliminar={handleIgnoreDelete} 
                />
              </div>
            );
          })
        ) : (
          <div className="text-white/40 text-center col-span-full py-20 font-mono text-sm">
            ERROR_CODE: DECK_EMPTY // No se encontraron cartas registradas.
          </div>
        )}
      </div>
    </div>
  );
}

export default SeleccionarCarta;