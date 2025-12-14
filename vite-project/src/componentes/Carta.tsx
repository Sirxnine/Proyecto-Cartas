import type { CartaProps } from '../types/index';

function Carta({ carta, onClick }: CartaProps) {

  const coloresRareza = {
    'SS': 'border-yellow-500 bg-gradient-to-br from-yellow-900/30 to-red-900/30',
    'S': 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-pink-900/30',
    'A': 'border-blue-500 bg-gradient-to-br from-blue-900/30 to-cyan-900/30',
    'B': 'border-green-500 bg-gradient-to-br from-green-900/30 to-emerald-900/30',
    'C': 'border-gray-500 bg-gradient-to-br from-gray-900/30 to-slate-900/30'
  };

  const colorRareza = coloresRareza[carta.rareza as keyof typeof coloresRareza] || coloresRareza.C;

  return (
    <button
      onClick={() => onClick(carta)}
      className={`w-full rounded-xl p-4 border-2 ${colorRareza} 
        cursor-pointer hover:scale-105 transition-all duration-300 
        transform hover:shadow-xl text-left focus:outline-none 
        focus:ring-2 focus:ring-red-500`}
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img
          src={carta.imagen}
          alt={carta.nombre}
          className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://preview.redd.it/characters-that-can-be-recognized-with-just-their-silhouette-v0-ytm08da795qc1.jpg?width=374&format=pjpg&auto=webp&s=854ae5998b018e53a292ef0adc1f5716d89777f8';
          }}
        />
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
          {carta.rareza}
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{carta.nombre}</h3>
      
      <p className="text-gray-300 text-sm mb-2">{carta.tipo}</p>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-red-900/30 rounded p-2">
          <p className="text-red-300 text-xs">💥 ATAQUE</p>
          <p className="text-white font-bold">{carta.poder}</p>
        </div>
        <div className="bg-blue-900/30 rounded p-2">
          <p className="text-blue-300 text-xs">🛡️ DEFENSA</p>
          <p className="text-white font-bold">{carta.defensa}</p>
        </div>
      </div>
    </button>
  );
}

export default Carta;