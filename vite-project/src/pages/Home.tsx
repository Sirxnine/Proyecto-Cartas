//Importaciones de librerías y componentes
import { BsFeather, BsArrowRepeat } from "react-icons/bs";
import { RiLoader4Line } from "react-icons/ri";
import Header from "../componentes/Header";
import ListaCartas from "../componentes/ListaCartas";
import ModalCarta from "../componentes/ModalCarta";
import { useMemo, useState } from "react";
import type { Carta } from "../types";
import type { HomeProps } from "../types/index";

// Componente principal de la página de inicio, con búsqueda, listado de cartas y modal de detalles
const Home = ({ cartas, loading, eliminarCarta }: HomeProps) => {

  {/* Estado para la búsqueda, control del modal y carta seleccionada para mostrar en el modal */}
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);

  {/* Filtrar las cartas según la búsqueda, buscando en el nombre y tipo de carta */}
  const cartasFiltradas = useMemo(() => {
    return cartas.filter(carta =>
      carta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      carta.tipo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [cartas, busqueda]);

  {/* Función para abrir el modal con los detalles de la carta seleccionada */}
  const abrirModalCarta = (carta: Carta) => {
    setCartaSeleccionada(carta);
    setMostrarModal(true);
  };

  {/* Función para cerrar el modal, limpiando la carta seleccionada después de una pequeña animación de cierre */}
  const cerrarModal = () => {
    setMostrarModal(false);
    setTimeout(() => setCartaSeleccionada(null), 300);
  };

  {/* Componente de spinner de carga para mostrar mientras se obtienen los datos de la API */}
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
                <div>
                  <BsArrowRepeat className="animate-spin text-cyan-400" />
                  SINCRONIZANDO...
                </div>
              ) : (
                <div>
                  {busqueda ? `Resultados: ${cartasFiltradas.length}` : 'Colección Completa'}
                  <BsFeather className="inline text-xs not-italic ml-1 font-serif opacity-90" />
                </div>
              )}
            </span>
            
            <div className="h-px grow bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Loading state para fetch inicial */}
          {loading.fetch && cartas.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <div>
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

              {/*Llamar al modal de carta con la carta seleccionada y control de apertura/cierre */}
              <ModalCarta
                carta={cartaSeleccionada}
                isOpen={mostrarModal}
                onClose={cerrarModal}
              />
              
              <div className="animate-in fade-in duration-700">
                {/* Componente de lista de cartas, pasando las cartas filtradas, función para abrir el modal y función para eliminar carta con estado de carga para eliminación */}
                <ListaCartas 
                  cartas={cartasFiltradas} 
                  onCartaClick={abrirModalCarta}  
                  onEliminarCarta={eliminarCarta}
                  loadingDelete={loading.delete} 
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