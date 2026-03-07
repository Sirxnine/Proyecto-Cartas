import { useState } from "react";
import { RiAddLine, RiImageAddLine, RiShieldLine, RiSwordLine, RiHistoryLine } from "react-icons/ri";
import { BsFeather } from "react-icons/bs";
import { useNavigate } from 'react-router';

const FormularioCarta = ({ onCrear }: { onCrear: (carta: any) => void }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Luchador',
    poder: 0,
    defensa: 0,
    habilidadUltimate: '',
    descripcion: '',
    imagen: '',
    hp: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCrear({ ...formData, id: Date.now() });
    setFormData({ nombre: '', tipo: 'Luchador', poder: 0, defensa: 0, habilidadUltimate: '', descripcion: '', imagen: '', hp: 0 });
    navigate('/');
  };

  const navigate = useNavigate();

  return (
    /* Fondo */
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 overflow-hidden bg-[#030303]">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      {/* Tarjeta del Form */}
      <div className="relative z-10 w-full max-w-4xl bg-white/3 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.8)]">

        {/* Adorno de esquina */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-[2.5rem] pointer-events-none" />

        <header className="mb-12 relative">
          <div className="flex items-center gap-5 mb-4">
            <div className="h-12 w-1.5 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase italic">
              Crea tu <span className="text-cyan-400">Carta</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-white/40 font-mono text-[9px] tracking-[0.4em] uppercase">
            <span>Protocolo: V-Series_01</span>
            <span className="h-px w-20 bg-white/10" />
            <span className="flex items-center gap-1 text-cyan-400/60"> <BsFeather /> Sistema Online</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

          {/* Nombre */}
          <div className="group space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">Nombre de la Personaje</label>
            <input
              type="text" required placeholder="Ej: Pegasus Seiya"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white focus:border-cyan-500/50 focus:bg-cyan-500/5 outline-none transition-all italic font-semibold shadow-inner"
            />
          </div>

          {/* Tipo */}
          <div className="group space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">Tipo</label>
            <div className="relative">
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white focus:border-cyan-500/50 outline-none transition-all cursor-pointer appearance-none"
              >
                <option value="Luchador">Luchador</option>
                <option value="Estratega">Estratega</option>
                <option value="Mago">Mago</option>
                <option value="Ninja">Ninja</option>
                <option value="Dios">Dios</option>
                <option value="Tanque">Tanque</option>
                <option value="Espadachin">Espadachin</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">▼</div>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-linear-to-br from-white/2 to-transparent p-8 rounded-4xl border border-white/5 relative overflow-hidden">

            {/* Input HP */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-green-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiShieldLine /> Vitalidad (HP)
              </div>
              <input
                type="number" required value={formData.hp}
                onChange={(e) => setFormData({ ...formData, hp: Number(e.target.value) })}
                className="w-full bg-black/60 border border-green-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-green-500 transition-all outline-none"
              />
            </div>

            {/* Input Ataque */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-red-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiSwordLine /> Ataque
              </div>
              <input
                type="number" required value={formData.poder}
                onChange={(e) => setFormData({ ...formData, poder: Number(e.target.value) })}
                className="w-full bg-black/60 border border-red-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-red-500 transition-all outline-none"
              />
            </div>

            {/* Input Defensa */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-blue-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiShieldLine /> Defensa
              </div>
              <input
                type="number" required value={formData.defensa}
                onChange={(e) => setFormData({ ...formData, defensa: Number(e.target.value) })}
                className="w-full bg-black/60 border border-blue-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Imagen */}
          <div className="md:col-span-2 group space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-cyan-400"> URL de la Imagen </label>
            <div className="relative">
              <RiImageAddLine className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 text-xl" />
              <input
                type="url" placeholder="https://..." value={formData.imagen}
                onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                className="w-full bg-black/40 border border-white/10 pl-12 p-4 rounded-2xl text-white focus:border-cyan-500/50 outline-none transition-all"
              />
            </div>
          </div>

          {/* Ulti */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"> <RiAddLine /> Ulti </label>
            <textarea
              rows={3} value={formData.habilidadUltimate}
              onChange={(e) => setFormData({ ...formData, habilidadUltimate: e.target.value })}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white focus:border-cyan-500/50 outline-none resize-none"
            />
          </div>

          {/* Descripción / Lore */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"> <RiHistoryLine /> Lore / Descripción</label>
            <textarea
              rows={3} value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white focus:border-cyan-500/50 outline-none resize-none"
            />
          </div>

          {/* Boton de Crear */}
          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              className="group relative w-full bg-cyan-500 hover:bg-cyan-400 py-6 rounded-2xl transition-all duration-500 overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.25)]"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 text-black font-black uppercase italic tracking-tighter text-xl flex items-center justify-center gap-3">
                Crear Carta <RiAddLine className="text-2xl" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCarta;