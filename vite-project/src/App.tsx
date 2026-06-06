import { useEffect, useState } from 'react';
import { toApiCardMapper, toCardApiMapper, type Carta, type IApiCard } from './types/index';
import { Route, Routes } from 'react-router';
import FormularioCarta from './pages/Form';
import Home from './pages/Home';
import EditarCarta from './pages/updateCard';
import SeleccionarCarta from './componentes/SeleccionarCarta';
import CampoBatalla from './pages/CampoBatalla';

export const API_URL = import.meta.env.VITE_EDUCA_API_URL;

function App() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] = useState({
    fetch: false,    
    create: false,    
    update: false,    
    delete: false     
  });

  const setLoadingState = (operation: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [operation]: value }));
  };

  const fetchCartas = async () => {
  setLoadingState('fetch', true);
  try {
    console.log('Fetching cartas from API...', API_URL);
    const response = await fetch(`${API_URL}/card`, {
      headers: {
        usersecretpasskey: "Leon422088LA"
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }

    const data = await response.json() as { data: IApiCard[] };
    
    // Condición: Validamos que la API realmente devuelva el array de datos esperado
    if (data && data.data) {
      const cartasFromApi: IApiCard[] = data.data;
      const cartasMapped: Carta[] = cartasFromApi.map(toCardApiMapper);
      setCartas(cartasMapped);
    }
    
  } catch (e) {
    console.error('Error fetching cartas:', e);
  } finally {
    // CONDICIÓN DEFINITIVA: Pase lo que pase en el try o el catch, 
    // el loading TIENE que bajarse a false para desbloquear la interfaz.
    setLoadingState('fetch', false); 
  }
};

  useEffect(() => {
    fetchCartas();
  }, []);

  const updateCarta = async (carta: Carta) => {
    setLoadingState('update', true);
    try {
      const response = await fetch(`${API_URL}/card/${carta.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "usersecretpasskey": "Leon422088LA"
        },
        body: JSON.stringify(toApiCardMapper(carta))
      });

      if (!response.ok) throw new Error("Error en la respuesta de la API");
      
      await fetchCartas(); 
      return { success: true };
    } catch (e) {
      console.error("Error al actualizar la carta:", e);
      return { success: false, error: e };
    } finally {
      setLoadingState('update', false);
    }
  };

  const deleteCarta = async (id: number) => {
    setLoadingState('delete', true);
    try {
      const response = await fetch(`${API_URL}/card/${id}`, {
        method: "DELETE",
        headers: { usersecretpasskey: "Leon422088LA" },
      });

      if (!response.ok) throw new Error("Error al eliminar la carta");

      await fetchCartas(); 
      return { success: true };
    } catch (e) {
      console.error("Error deleting carta:", e);
      return { success: false, error: e };
    } finally {
      setLoadingState('delete', false);
    }
  };

  return (
    <Routes>
      <Route path='/' element={
      <Home 
        cartas={cartas} 
        loading={loading} 
        eliminarCarta={deleteCarta} 
      />} />

      <Route path='/Form' element={
        <FormularioCarta 
          fetchCartas={fetchCartas} 
        />} />

      <Route path='/Edit/:id' element={
        <EditarCarta 
          cartas={cartas}
          onGuardar={updateCarta} 
          loading={loading.update} 
        />} />

      <Route path='/seleccionar-carta' element={
        <SeleccionarCarta 
          mazo={cartas} 
          loading={loading.fetch} 
        />} />

      <Route path='/campo-de-batalla/:id1/:id2' element={
        <CampoBatalla 
          cartas={cartas} />} 
      />
    </Routes>
  );
}

export default App;