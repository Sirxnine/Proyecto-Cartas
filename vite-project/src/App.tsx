import { useState, useMemo } from 'react';
import Header from './componentes/Header';
import ListaCartas from './componentes/ListaCartas';
import ModalCarta from './componentes/ModalCarta';
import { cartasEjemplo } from './componentes/CartasIniciales';
import type { Carta } from './types/index';
import { BsFeather } from "react-icons/bs";

function App() {
  const [cartas, setCartas] = useState<Carta[]>(cartasEjemplo);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);

  const cartasFiltradas = useMemo(() => {
    return cartas.filter(carta =>
      carta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      carta.anime.toLowerCase().includes(busqueda.toLowerCase())
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

    const añadirCarta = (nueva: Carta) => {
    setCartas([nueva, ...cartas]);
  };

  const eliminarCarta = (id: number) => {
  setCartas(cartas.filter(c => c.id !== id));
};

  return (
    
    <div className="relative flex flex-col min-h-screen bg-[#050505] text-slate-100 selection:bg-cyan-500/30">
          

      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      <div className="fixed -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-900/10 blur-[120px] rounded-full"></div>
      <div className="fixed -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full"></div>

      <div className="relative z-10">
        <Header busqueda={busqueda} setBusqueda={setBusqueda} />
        
        <main className="container mx-auto px-4 py-10">
          
          {/* Indicador de resultados */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px grow bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
            <span className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase italic">
              {busqueda ? `Resultados: ${cartasFiltradas.length}` : 'Colección Completa'} <BsFeather className="inline text-xs not-italic ml-1 font-serif opacity-90" />
            </span>
            <div className="h-px grow bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Buscador */}
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

          {/* Modal */}
          <ModalCarta
            carta={cartaSeleccionada}
            isOpen={mostrarModal}
            onClose={cerrarModal}
          />
          {/* Lista de Cartas */}
          <div className="animate-in fade-in duration-700">
            <ListaCartas 
            cartas={cartasFiltradas} 
            onCartaClick={abrirModalCarta}  
            onEliminarCarta={eliminarCarta}/>
          </div> 
        </main>
      </div>
    </div>
  );
}

export default App;