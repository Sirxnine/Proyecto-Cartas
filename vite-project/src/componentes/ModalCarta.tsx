import type { ModalCartaProps } from '../types/index';

function ModalCarta({ carta, isOpen, onClose }: ModalCartaProps) {
  if (!isOpen || !carta) return null;

  const getColorRareza = (rareza: string) => {
    switch(rareza) {
      case 'SS': return 'bg-gradient-to-br from-yellow-900/90 to-red-900/90';
      case 'S': return 'bg-gradient-to-br from-purple-900/90 to-pink-900/90';
      case 'A': return 'bg-gradient-to-br from-blue-900/90 to-cyan-900/90';
      case 'B': return 'bg-gradient-to-br from-green-900/90 to-emerald-900/90';
      default: return 'bg-gradient-to-br from-gray-900/90 to-slate-900/90';
    }
  };

  const modalColor = getColorRareza(carta.rareza);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className={`${modalColor} rounded-2xl border-2 border-red-600 max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        
        <div className="flex justify-between items-center p-6 border-b border-red-500/30">
          <h2 className="text-2xl font-bold text-white">{carta.nombre}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 text-2xl transition-colors"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="flex flex-col">
            <div className="flex-1">
              <img
                src={carta.imagen}
                alt={carta.nombre}
                className="w-full h-auto max-h-[500px] object-contain rounded-lg border-2 border-red-500/50"
                onError={(e) => {
                  e.currentTarget.src = 'https://preview.redd.it/characters-that-can-be-recognized-with-just-their-silhouette-v0-ytm08da795qc1.jpg?width=374&format=pjpg&auto=webp&s=854ae5998b018e53a292ef0adc1f5716d89777f8';
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-red-900/40 rounded-lg p-4">
                <p className="text-red-300 text-sm">💥 PODER</p>
                <p className="text-white font-bold text-2xl">{carta.poder}</p>
                <div className="h-2 bg-red-900 rounded-full mt-2">
                  <div 
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(carta.poder / 10000) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-blue-900/40 rounded-lg p-4">
                <p className="text-blue-300 text-sm">🛡️ DEFENSA</p>
                <p className="text-white font-bold text-2xl">{carta.defensa}</p>
                <div className="h-2 bg-blue-900 rounded-full mt-2">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(carta.defensa / 10000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 rounded-lg p-4">
                <p className="text-gray-400 text-sm">TIPO</p>
                <p className="text-white font-bold text-lg">{carta.tipo}</p>
              </div>
              <div className="bg-black/40 rounded-lg p-4">
                <p className="text-gray-400 text-sm">RAREZA</p>
                <p className="text-white font-bold text-lg">{carta.rareza}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2">📜 DESCRIPCIÓN</h3>
              <p className="text-gray-300 leading-relaxed">{carta.descripcion}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                <h3 className="text-lg font-bold text-green-300 mb-2">⚙️ HABILIDAD PASIVA</h3>
                <p className="text-gray-300">{carta.habilidadPasiva}</p>
              </div>
              
              <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-500/30">
                <h3 className="text-lg font-bold text-yellow-300 mb-2">💫 HABILIDAD ULTIMATE</h3>
                <p className="text-gray-300">{carta.habilidadUltimate}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCarta;