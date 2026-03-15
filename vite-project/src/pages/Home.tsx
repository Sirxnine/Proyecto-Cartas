import { BsFeather, BsArrowRepeat } from "react-icons/bs";
import { RiLoader4Line } from "react-icons/ri";
import Header from "../componentes/Header";
import ListaCartas from "../componentes/ListaCartas";
import ModalCarta from "../componentes/ModalCarta";
import { useMemo, useState } from "react";
import type { Carta } from "../types";
import type { HomeProps } from "../types/index";


const Home = ({ cartas, loading, añadirCarta, eliminarCarta }: HomeProps) => {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);

  const cartasFiltradas = useMemo(() => {
    return cartas.filter(carta =>
      carta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      carta.tipo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [cartas, busqueda]);

  const abrirModalCarta = (carta: Carta) => {
    setCartaSeleccionada(carta);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTimeout(() => setCartaSeleccionada(null), 300);
  };

  // Componente de loading personalizado
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <RiLoader4Line className="text-cyan-400 text-5xl animate-spin" />
      <p className="text-cyan-400/70 text-sm font-mono mt-4 tracking-widest animate-pulse">
        CARGANDO DATOS...
      </p>
    </div>
  );

  return (
    <div className="relative flex flex-col min-h-screen bg-[#050505] text-slate-100 selection:bg-cyan-500/30">

      <div className="relative z-10">
        <Header busqueda={busqueda} setBusqueda={setBusqueda} />
        
        <main className="container mx-auto px-4 py-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px grow bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
            
            {/* Indicador de estado con loading */}
            <span className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase italic flex items-center gap-2">
              {loading.fetch ? (
                <>
                  <BsArrowRepeat className="animate-spin text-cyan-400" />
                  SINCRONIZANDO...
                </>
              ) : (
                <>
                  {busqueda ? `Resultados: ${cartasFiltradas.length}` : 'Colección Completa'}
                  <BsFeather className="inline text-xs not-italic ml-1 font-serif opacity-90" />
                </>
              )}
            </span>
            
            <div className="h-px grow bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Loading state para fetch inicial */}
          {loading.fetch && cartas.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <>
              {busqueda.trim() !== "" && cartasFiltradas.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/2">
                  <p className="text-cyan-400 text-2xl font-black italic tracking-tighter uppercase mb-2">
                    No se encontraron cartas <BsFeather className="inline text-3xl not-italic ml-1 font-serif opacity-90" />
                  </p>
                  <p className="text-white/40 text-xs font-mono tracking-widest">
                    ERROR_CODE: UNIT_NOT_FOUND // Prueba con otro nombre o tipo
                  </p>
                </div>
              )}

              <ModalCarta
                carta={cartaSeleccionada}
                isOpen={mostrarModal}
                onClose={cerrarModal}
              />
              
              <div className="animate-in fade-in duration-700">
                <ListaCartas 
                  cartas={cartasFiltradas} 
                  onCartaClick={abrirModalCarta}  
                  onEliminarCarta={eliminarCarta}
                  onAñadirCarta={añadirCarta} 
                  loadingDelete={loading.delete} 
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;