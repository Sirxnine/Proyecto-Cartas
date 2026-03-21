import { useEffect, useState } from 'react';
import { toApiCardMapper, toCardApiMapper, type Carta, type IApiCard } from './types/index';
import { Route, Routes } from 'react-router';
import FormularioCarta from './pages/Form';
import Home from './pages/Home';
import EditarCarta from './pages/updateCard';

export const API_URL = import.meta.env.VITE_EDUCA_API_URL;

function App() {
  const [cartas, setCartas] = useState<Carta[]>([])
  
  // Estados de loading para diferentes operaciones
  const [loading, setLoading] = useState({
    fetch: false,     // Cargando lista inicial
    create: false,    // Creando carta
    update: false,    // Actualizando carta
    delete: false     // Eliminando carta
  });

  // Función para actualizar loading de forma segura
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

      const data = await response.json() as { data: IApiCard[] };
      console.log(data);
      const cartasFromApi: IApiCard[] = data.data;
      const cartasMapped: Carta[] = cartasFromApi.map(toCardApiMapper);
      console.log(cartasMapped);
      setCartas(cartasMapped);
    } catch (e) {
      console.error('Error fetching cartas:', e);
      // Podríamos mostrar un toast de error aquí
    } finally {
      setLoadingState('fetch', true);
    }
  };

  useEffect(() => {
    fetchCartas();
  }, []);


  
  const updateCarta = async (carta: Carta) => {
    setLoadingState('update', true);
    try {
      console.log('Enviando datos a la API:', toApiCardMapper(carta));
      const response = await fetch(`${API_URL}/card/${carta.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "usersecretpasskey": "Leon422088LA"
        },
        body: JSON.stringify(toApiCardMapper(carta))
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }
      
      console.log("Actualización exitosa");
      await fetchCartas(); // Recargamos la lista
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

      if (!response.ok) {
        throw new Error("Error al eliminar la carta");
      }

      await fetchCartas(); // Recargamos la lista
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
      <Route 
        path='/' 
        element={
          <Home 
            cartas={cartas} 
            loading={loading} // Pasamos todos los estados de loading 
            eliminarCarta={deleteCarta} 
          />
        } 
      />
      <Route 
        path='/Form' 
        element={
          <FormularioCarta 
             fetchCartas={fetchCartas} // Pasamos la función para recargar cartas después de crear
          />
        } 
      />
      <Route 
        path='/Edit/:id' 
        element={
          <EditarCarta 
          cartas={cartas}   
            onGuardar={updateCarta}
            loading={loading.update} // Pasamos solo el loading de update
          />
        } 
      />
    </Routes>
  );
}

export default App;