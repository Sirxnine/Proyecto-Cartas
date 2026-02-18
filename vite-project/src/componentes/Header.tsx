import type { HeaderProps } from '../types/index';
import { BsFeather } from "react-icons/bs";

function Header({ busqueda, setBusqueda,mostrarForm,setMostrarForm }: HeaderProps) {
  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Logo con estilo de Medalla/Energía */}
          <div className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full group-hover:bg-cyan-500/20 transition-colors"></div>
              <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-gray-200
                via-gray-400 to-gray-600 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(255,255,255,0.2)] border-2
                border-white/50 transform group-hover:rotate-12 transition-transform">
                🥋
              </div>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black italic tracking-tighter text-white drop-shadow-lg">
                <span className="text-cyan-400 flex ">CARTAS<BsFeather className="text-3xl not-italic ml-1 font-serif opacity-90" /> </span>
              </h1>
              <div className="h-1 w-full bg-linear-to-r from-cyan-500 to-transparent rounded-full opacity-50"></div>
            </div>
          </div>

       <button
        className={`
        px-8 py-3 rounded-full font-black italic uppercase tracking-tighter 
        transition-all duration-300 transform active:scale-95 border-2

    ${mostrarForm 
      ? 'bg-cyan-60 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
      : 'bg-black text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:border-cyan-400'
    }
  `}
  onClick={() => setMostrarForm(!mostrarForm)}
>
  {mostrarForm ? '✕ Cerrar' : '＋ Crear Carta'}
</button>


          {/* Buscador Estilo Barra de Menú de Juego */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="BUSCAR UNIDAD..."
              className="w-full px-5 py-3 pl-12 bg-white/5 border border-white/10 rounded-2xl 
                text-white placeholder-white/30 uppercase font-bold text-xs tracking-widest
                focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 
                transition-all backdrop-blur-xl shadow-inner italic"
            />
            <div className="absolute left-4 top-3 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              🔍
            </div>
            {/* Decoración de esquina en el input */}
            <div className="absolute right-0 top-0 h-full w-1 bg-cyan-500 rounded-r-2xl"></div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;