import { useEffect, useState,  } from 'react';
import { cartasEjemplo } from './componentes/CartasIniciales';
import { toApiCardMapper, toCardApiMapper, type Carta, type IApiCard } from './types/index';
import { Route, Routes } from 'react-router';
import FormularioCarta from './pages/Form';
import Home from './pages/Home';
import EditarCarta from './pages/updateCard';

const API_URL = import.meta.env.VITE_EDUCA_API_URL

function App() {
  const [cartas, setCartas] = useState<Carta[]>(cartasEjemplo);
  // const añadirCarta = (nueva: Carta) => {
  // setCartas([nueva, ...cartas]);
  // };

 // const eliminarCarta = (id: number) => {
  //setCartas(cartas.filter(c => c.id !== id));
  //};

  const [loading, setLoading] = useState(false);



  const fetchCartas = async () => {
    setLoading(true);
    try {
      console.log('Fetching cartas from API...', API_URL);
      const response = await fetch(`${API_URL}/card`, {
        headers: {
          usersecretpasskey:"Leon422088LA"
        }
      })
      
      const data = await response.json() as {data: IApiCard[]};
      console.log(data)
      const cartasFromApi: IApiCard[] = data.data
      const cartasMapped: Carta[] = cartasFromApi.map(toCardApiMapper)
      console.log(cartasMapped)
        setCartas(cartasMapped);
    } catch (e) {
      console.error('Error fetching cartas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
  }, [fetch]);

  const addCarta = async (carta: Carta) => {
        try {
            await fetch(`${API_URL}/card`, {
                method: "POST",
                headers: {"Content-Type": "application/json", usersecretpasskey:"Leon422088LA"},
                body: JSON.stringify(toApiCardMapper(carta))
            });
            fetchCartas();
        } catch (e) {
            console.error("Error adding task:", e);
        }}

  const deleteCarta = async (id: number) => {
        try {
            const card = cartas.find((c) => c.id === id);
            if (!card) return;  
            await fetch(`${API_URL}/card/${id}`, {
                method: "DELETE",
                headers: { usersecretpasskey:"Leon422088LA"},
            });
            fetchCartas();
        } catch (e) {
            console.error("Error updating carta:", e);  
        }
    };

  return (
      <Routes>
      <Route path='/' element={<Home añadirCarta={addCarta} eliminarCarta={deleteCarta} cartas={cartas} />} />
      <Route path='/Form' element={<FormularioCarta onCrear={addCarta} />} />
      
    </Routes>
  
  );

}

export default App;