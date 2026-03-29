//Importaciones de React, mapeadores para convertir entre la estructura de la carta en la API y la estructura utilizada en la aplicación, tipos de carta e interfaz para las cartas obtenidas de la API, y componentes de rutas para las diferentes páginas del proyecto

import { useEffect, useState } from 'react';
import { toApiCardMapper, toCardApiMapper, type Carta, type IApiCard } from './types/index';
import { Route, Routes } from 'react-router';
import FormularioCarta from './pages/Form';
import Home from './pages/Home';
import EditarCarta from './pages/updateCard';


  // URL base de la API, obtenida de las variables de entorno
export const API_URL = import.meta.env.VITE_EDUCA_API_URL;

function App() {
  // Estado para almacenar las cartas obtenidas de la API
  const [cartas, setCartas] = useState<Carta[]>([])
  
  // Estados de loading para diferentes operaciones
  const [loading, setLoading] = useState({
    fetch: false,    
    create: false,    
    update: false,    
    delete: false     
  });

  // Función para actualizar loading
  const setLoadingState = (operation: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [operation]: value }));
  };

// Función para obtener las cartas desde la API
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
    } finally {
      setLoadingState('fetch', true);
    }
  };

  useEffect(() => {
    fetchCartas();
  }, []);


{/*  Función para actualizar una carta, recibiendo la carta actualizada, enviándola a la API y recargando la lista de cartas después de la actualización */}
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
      await fetchCartas(); 
      return { success: true };
    } catch (e) {
      console.error("Error al actualizar la carta:", e);
      return { success: false, error: e };
    } finally {
      setLoadingState('update', false);
    }
  };

  {/* Función para eliminar una carta, recibiendo el ID de la carta a eliminar, enviando la solicitud a la API y recargando la lista de cartas después de la eliminación */}
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