import { 
  RiCloseLine, 
  RiSwordLine, 
  RiShieldLine, 
  RiHeartPulseLine,
  RiLoader4Line,
  RiAlertLine,
  RiEyeLine
} from "react-icons/ri";
import { useState } from "react";
import type { Carta as CartaType } from '../types';

interface CartaProps {
  carta: CartaType;
  onClick: (carta: CartaType) => void;
  onEliminar: (id: number) => void;
  isDeleting?: boolean;
}

function Carta({ carta, onClick, onEliminar, isDeleting = false }: CartaProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  const puntosVida = carta.hp || 0;
  const puntosAtaque = carta.poder || 0;
  const puntosDefensa = carta.defensa || 0;

  // Error de imagen: mostrar placeholder y evitar spinner infinito
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Click de confirmación 
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(false);
    onEliminar(carta.id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(false);
  };

  // Click en carta si no es para eliminar
  const handleCardClick = () => {
    if (!isDeleting && !showConfirmDelete) {
      onClick(carta);
    }
  };

  return (
    <div className="group relative w-full aspect-[1/1.4]">
      {/* Botón de eliminar con confirmación */}
      {!showConfirmDelete ? (
        <button 
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className={`absolute -top-2 -right-2 z-40 p-1.5 rounded-full shadow-lg transition-all ${
            isDeleting 
              ? 'bg-gray-600 cursor-not-allowed opacity-50' 
              : 'bg-red-600 hover:bg-red-500 opacity-0 group-hover:opacity-100'
          }`}
          title={isDeleting ? "Eliminando..." : "Eliminar carta"}
        >
          {isDeleting ? (
            <RiLoader4Line size={18} className="animate-spin" />
          ) : (
            <RiCloseLine size={18} />
          )}
        </button>
      ) : (
        <div className="absolute -top-2 -right-2 z-50 flex gap-1">
          <button
            onClick={handleConfirmDelete}
            className="p-1.5 bg-red-600 hover:bg-red-500 text-white rounded-l-lg shadow-lg transition-all text-xs font-black uppercase"
            title="Confirmar eliminación"
          >
            ✓
          </button>
          <button
            onClick={handleCancelDelete}
            className="p-1.5 bg-gray-600 hover:bg-gray-500 text-white rounded-r-lg shadow-lg transition-all text-xs font-black uppercase"
            title="Cancelar"
          >
            ✗
          </button>
        </div>
      )}

      {/* Indicador de "viendo detalles" */}
      <div className="absolute -top-2 -left-2 z-40 p-1.5 bg-cyan-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">
        <RiEyeLine size={14} />
      </div>

      {/* Overlay de carga de imagen */}
      {imageLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 rounded-[2.5rem]">
          <RiLoader4Line className="text-cyan-400 text-4xl animate-spin" />
        </div>
      )}

      <button 
        onClick={handleCardClick}
        disabled={isDeleting || showConfirmDelete}
        className={`relative h-full w-full rounded-[2.5rem] p-1 bg-[#121212] border border-white/10 overflow-hidden transition-all duration-500 ${
          isDeleting || showConfirmDelete
            ? 'opacity-50 cursor-not-allowed' 
            : 'group-hover:scale-[1.02] group-hover:border-cyan-500/50'
        }`}
      >
        <div className="relative h-full w-full rounded-[2.2rem] overflow-hidden bg-black">
          {/* Opción si la imagen falla */}
          {!imageError ? (
            <img 
              src={carta.imagen} 
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoading ? 'opacity-0' : 'opacity-80 group-hover:opacity-100'
              }`}
              alt={carta.nombre}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
              <RiAlertLine className="text-gray-500 text-4xl mb-2" />
              <span className="text-gray-500 text-xs font-mono">Sin imagen</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/60" />

          {/* Nombre y HP */}
          <div className="absolute top-4 left-4 right-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="bg-white px-3 py-0.5 -skew-x-12 shadow-lg">
                <span className="text-[10px] font-black text-black uppercase tracking-wider">
                  {carta.nombre}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-green-500/50 shadow-lg">
                <RiHeartPulseLine className="text-green-400 text-[10px]" />
                <span className="text-[10px] font-black text-white">{puntosVida}</span>
              </div>
            </div>
            
            {/* Tipo de carta (opcional) */}
            {carta.tipo && (
              <div className="flex justify-start">
                <div className="bg-purple-900/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-purple-500/30">
                  <span className="text-[8px] font-mono text-purple-300 uppercase tracking-wider">
                    {carta.tipo}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Atk y Def */}
          <div className="absolute bottom-5 left-4 right-4 flex gap-2">
            <div className="flex-1 flex justify-between items-center bg-red-900/80 backdrop-blur-sm border-l-2 border-red-500 px-2 py-1 rounded-r-lg shadow-lg">
              <RiSwordLine className="text-red-500 text-[10px]" />
              <span className="text-xs font-black text-white">{puntosAtaque}</span>
            </div>
            <div className="flex-1 flex justify-between items-center bg-blue-900/80 backdrop-blur-sm border-l-2 border-blue-500 px-2 py-1 rounded-r-lg shadow-lg">
              <RiShieldLine className="text-blue-500 text-[10px]" />
              <span className="text-xs font-black text-white">{puntosDefensa}</span>
            </div>
          </div>

          {/* Efecto de brillo en hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 bg-linear-to-t from-cyan-500/20 via-transparent to-transparent" />
          </div>
        </div>
      </button>

      {/* Tooltip con habilidad ultimate (opcional) */}
      {carta.habilidadUltimate && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          <div className="bg-black/90 backdrop-blur-sm text-white text-[6px] font-mono px-2 py-1 rounded border border-cyan-500/30 whitespace-nowrap shadow-lg">
            ⚡ {carta.habilidadUltimate.length > 30 
                ? carta.habilidadUltimate.substring(0, 30) + '...' 
                : carta.habilidadUltimate}
          </div>
        </div>
      )}
    </div>
  );
}

export default Carta;