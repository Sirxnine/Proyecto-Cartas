import { useState, useMemo } from 'react';
import type { Carta, NuevaCarta  } from './types/index';
import { cartasEjemplo, gruposAnime } from './componentes/CartasIniciales';
import Header from './componentes/Header';
import ListaGrupos from './componentes/ListaGrupo';
import VistaGrupo from './componentes/VistaGrupo';
import ModalCarta from './componentes/ModalCarta';

function App() {
  const [cartas, setCartas] = useState<Carta[]>(cartasEjemplo);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);
  const [grupoActivo, setGrupoActivo] = useState<string | null>(null);

    const cartasPorAnime = useMemo(() => {
    const grupos: Record<string, Carta[]> = {};
    cartas.forEach(carta => {
      if (!grupos[carta.anime]) {
        grupos[carta.anime] = [];
      }
      grupos[carta.anime].push(carta);
    });
    return grupos;
  }, [cartas]);

    const cartasFiltradas = useMemo(() => {
    const cartasBase = grupoActivo 
      ? cartasPorAnime[grupoActivo] || []
      : cartas;
    
    return cartasBase.filter(carta =>
      carta.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [cartas, grupoActivo, cartasPorAnime, busqueda]);

    const grupoActual = useMemo(() => {
    return gruposAnime.find(g => g.id === grupoActivo) || null;
  }, [grupoActivo]);

  const abrirModalCarta = (carta: Carta) => {
    setCartaSeleccionada(carta);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCartaSeleccionada(null);
  };

  const abrirGrupo = (grupoId: string) => {
    setGrupoActivo(grupoId);
    setBusqueda(''); 
  };

  const volverAGrupos = () => {
    setGrupoActivo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <Header busqueda={busqueda} setBusqueda={setBusqueda} />
      
      <main className="container mx-auto px-4 py-8">
        {busqueda.trim() !== "" && cartasFiltradas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-red-400 text-lg">No se encontraron Cartas con "{busqueda}"</p>
          </div>
        )}
        
        {!grupoActivo ? (

          <ListaGrupos
            grupos={gruposAnime}
            cartasPorAnime={cartasPorAnime}
            onGrupoClick={abrirGrupo}
          />

        ) : (
          <VistaGrupo
            grupo={grupoActual}
            cartas={cartasFiltradas}
            onCartaClick={abrirModalCarta}
            onVolver={volverAGrupos}
          />
        )}

        <ModalCarta
          carta={cartaSeleccionada}
          isOpen={mostrarModal}
          onClose={cerrarModal}
        />
      </main>
    </div>
  );
}

export default App;

