import { useState } from 'react';
import type { Carta, NuevaCarta } from './types/index';
import { cartasEjemplo } from './componentes/CartasIniciales';
import Header from './componentes/Header';
import ListaCartas from './componentes/ListaCartas';
import ModalCarta from './componentes/ModalCarta';

function App() {
  const [cartas, setCartas] = useState<Carta[]>(cartasEjemplo);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cartaEditando, setCartaEditando] = useState<Carta | null>(null);

  const cartasFiltradas = cartas.filter(carta =>
    carta.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalCarta = (carta: Carta) => {
    setCartaSeleccionada(carta);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCartaSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header busqueda={busqueda} setBusqueda={setBusqueda} />
      
      <main className="container mx-auto px-4 py-8">
        {busqueda.trim() !== "" && cartasFiltradas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-red-400 text-lg">No se encontraron luchadores con "{busqueda}"</p>
          </div>
        )}
        
        <ListaCartas 
          cartas={cartasFiltradas} 
          onCartaClick={abrirModalCarta} 
        />
        
        <ModalCarta carta={cartaSeleccionada} isOpen={mostrarModal} onClose={cerrarModal} />
      </main>
    </div>
  );
}

export default App;