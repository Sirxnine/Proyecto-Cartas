import { BsFeather, BsArrowRepeat } from "react-icons/bs";
import { RiLoader4Line } from "react-icons/ri";
import Header from "../componentes/Header";
import ListaCartas from "../componentes/ListaCartas";
import ModalCarta from "../componentes/ModalCarta";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router"; 
import type { Carta } from "../types";
import type { HomeProps } from "../types/index";

const Home = ({ cartas, loading, eliminarCarta, fetchCartas }: HomeProps & { fetchCartas: () => Promise<void> }) => {
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

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <RiLoader4Line className="text-cyan-400 text-5xl animate-spin" />
      <p className="text-cyan-400/70 text-sm font-mono mt-4 tracking-widest animate-pulse">
        <span>CARGANDO DATOS...</span>
      </p>
    </div>
  );

  useEffect(() => {
    fetchCartas(); // Se ejecutará cada vez que entres a la ruta Home
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#050505] text-slate-100 selection:bg-cyan-500/30">
      <div className="relative z-10">
        <Header busqueda={busqueda} setBusqueda={setBusqueda} />
        
        <main className="container mx-auto px-4 py-10">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px grow bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
            
            {/* CORREGIDO: Cambiado de <span> a <div> y envueltos todos los textos dinámicos/estáticos en <span> para evitar el desajuste en removeChild */}
            <div className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase italic flex items-center">
              {loading.fetch ? (
                <div className="flex items-center gap-2">
                  <BsArrowRepeat className="animate-spin text-cyan-400" />
                  <span>SINCRONIZANDO...</span>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <span>{busqueda ? `Resultados: ${cartasFiltradas.length}` : 'Colección Completa'}</span>
                    <BsFeather className="inline text-xs not-italic ml-1 font-serif opacity-90" />
                  </div>

                  <Link 
                    to="/seleccionar-carta"
                    className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500 text-cyan-400 font-mono text-[9px] tracking-widest rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] not-italic normal-case"
                  >
                    <span>MODO BATALLA ⚔️</span>
                  </Link>
                </div>
              )}
            </div>
            
            <div className="h-px grow bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {loading.fetch && cartas.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <div>
              {busqueda.trim() !== "" && cartasFiltradas.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/2">
                  <p className="text-cyan-400 text-2xl font-black italic tracking-tighter uppercase mb-2">
                    <span>No se encontraron cartas </span>
                    <BsFeather className="inline text-3xl not-italic ml-1 font-serif opacity-90" />
                  </p>
                  <p className="text-white/40 text-xs font-mono tracking-widest">
                    <span>ERROR_CODE: UNIT_NOT_FOUND // Prueba con otro nombre o tipo</span>
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
                  loadingDelete={loading.delete} 
                  fetchCartas={fetchCartas}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;