import { useState } from 'react';
import type { Carta, NuevaCarta } from './types/index';
import { cartasEjemplo } from './componentes/CartasIniciales';

function App() {
  const [cartas, setCartas] = useState<Carta[]>(cartasEjemplo);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);
  
  //const [mostrarFormulario, setMostrarFormulario] = useState(false);
  //const [cartaEditando, setCartaEditando] = useState<Carta | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950">
      {/* El Header vendrá aquí - Paso 3 */}
      
      <main className="container mx-auto px-4 py-8">
        {/* La ListaCartas vendrá aquí - Paso 4 */}
        
        {/* El ModalCarta vendrá aquí - Paso 5 */}
        
        {/* El FormularioCarta vendrá después - Paso 6 */}
      </main>
    </div>
  );
}

export default App;
