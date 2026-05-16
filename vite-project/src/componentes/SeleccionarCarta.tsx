import { useState } from 'react';
import type { Carta as CartaType } from '../types/index';
import Carta from './Carta'; 
import { Link } from 'react-router';

type Props = {
  mazo: CartaType[];
  loading: boolean;
};

function SeleccionarCarta({ mazo, loading }: Props) {
  const [cartaSeleccionada1, setCartaSeleccionada1] = useState<CartaType | null>(null);
  const [cartaSeleccionada2, setCartaSeleccionada2] = useState<CartaType | null>(null);

  const listoBatalla = cartaSeleccionada1 !== null && cartaSeleccionada2 !== null;

  const handleSeleccionarCarta = (carta: CartaType) => {
    const isSelected1 = cartaSeleccionada1?.id === carta.id;
    const isSelected2 = cartaSeleccionada2?.id === carta.id;

    if (isSelected1) {
      setCartaSeleccionada1(null);
      return;
    }

    if (isSelected2) {
      setCartaSeleccionada2(null);
      return;
    }

    if (!cartaSeleccionada1) {
      setCartaSeleccionada1(carta);
    } else if (!cartaSeleccionada2) {
      setCartaSeleccionada2(carta);
    }
  };

  const handleIgnoreDelete = (id: number) => {
    console.log("No se pueden borrar cartas en el modo de selección. ID:", id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40 text-cyan-400 font-mono">
        Cargando mazo de batalla...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {listoBatalla && (
        <div className="text-center p-3 bg-cyan-500/10 border border-cyan-500 rounded-xl text-cyan-400 font-black animate-bounce">
          ¡LISTO PARA LA BATALLA!
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
        {mazo && mazo.length > 0 ? (
          mazo.map((carta) => {
            const estaSeleccionada =
              cartaSeleccionada1?.id === carta.id || cartaSeleccionada2?.id === carta.id;

            return (
              <div
                key={carta.id}
                className={`transition-all duration-300 rounded-[2.5rem] ${
                  estaSeleccionada 
                    ? 'ring-4 ring-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.6)] scale-[1.03]' 
                    : 'hover:scale-[1.02]'
                }`}
              >
                <Carta
                  carta={carta}
                  onClick={handleSeleccionarCarta}
                  onEliminar={handleIgnoreDelete} 
                />
              </div>
            );
          })
        ) : (
          <div className="text-white/40 text-center col-span-full py-10 font-mono text-sm">
            No hay cartas disponibles en el mazo.
          </div>
        )}
      </div>
    </div>
  );

  <Link to={`/campo-de-batalla/${cartaSeleccionada1?.id}/${cartaSeleccionada2?.id}`}
  >
    Ir al campo de batalla
  </Link>
}

export default SeleccionarCarta;