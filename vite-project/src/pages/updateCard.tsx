import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { RiSaveLine, RiImageAddLine, RiShieldLine, RiSwordLine, RiHistoryLine, RiArrowLeftLine, RiFocus3Line } from "react-icons/ri";
import { BsFeather } from "react-icons/bs";
import { cartasEjemplo } from "../componentes/CartasIniciales"; // Importamos tus datos locales por ahora
import type { Carta } from "../types";

const EditarCarta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estado para el formulario
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

  // Efecto para buscar la carta por ID al cargar
  useEffect(() => {
    // Buscamos en tus cartas locales usando el ID de la URL
    const cartaEncontrada = cartasEjemplo.find(c => c.id === Number(id));
    
    if (cartaEncontrada) {
      setFormData({
        nombre: cartaEncontrada.nombre,
        tipo: cartaEncontrada.tipo,
        poder: cartaEncontrada.poder,
        defensa: cartaEncontrada.defensa,
        habilidadUltimate: cartaEncontrada.habilidadUltimate,
        descripcion: cartaEncontrada.descripcion,
        imagen: cartaEncontrada.imagen,
        hp: cartaEncontrada.hp
      });
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría tu lógica de guardado (por ahora solo redirigimos)
    console.log("Actualizando carta con ID:", id, formData);
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 overflow-hidden bg-[#030303]">
      {/* Fondo Ambientado */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-2xl">
        
        {/* Header de Edición */}
        <header className="mb-12 relative flex justify-between items-start">
          <div>
            <div className="flex items-center gap-5 mb-4">
              <div className="h-12 w-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                Editar <span className="text-amber-400">Carta</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 text-white/40 font-mono text-[9px] tracking-[0.4em] uppercase">
              <span className="flex items-center gap-1 text-amber-500/60"> <BsFeather /> ID de Registro: {id}</span>
              <span className="h-px w-20 bg-white/10" />
              <span>Modo: Local_Override</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors font-black uppercase text-[10px] tracking-widest"
          >
            <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" /> Volver al Mazo
          </button>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Nombre del Personaje</label>
            <input 
              type="text" 
              value={formData.nombre} 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white focus:border-amber-500/50 outline-none transition-all font-semibold italic" 
            />
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tipo de Unidad</label>
            <div className="relative">
              <select 
                value={formData.tipo} 
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none appearance-none cursor-pointer"
              >
                <option value="Luchador">Luchador</option>
                <option value="Estratega">Estratega</option>
                <option value="Mago">Mago</option>
                <option value="Ninja">Ninja</option>
                <option value="Tanque">Tanque</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500 text-xs">▼</div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="md:col-span-2 grid grid-cols-3 gap-6 bg-white/2 p-8 rounded-4xl border border-white/5">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-green-500/60 uppercase flex items-center gap-1"><RiShieldLine/> Vitalidad</label>
                <input type="number" value={formData.hp} onChange={(e)=>setFormData({...formData, hp: +e.target.value})} className="w-full bg-black/60 p-4 rounded-xl text-white text-2xl font-mono text-center outline-none border border-white/5 focus:border-green-500" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-red-500/60 uppercase flex items-center gap-1"><RiSwordLine/> Poder</label>
                <input type="number" value={formData.poder} onChange={(e)=>setFormData({...formData, poder: +e.target.value})} className="w-full bg-black/60 p-4 rounded-xl text-white text-2xl font-mono text-center outline-none border border-white/5 focus:border-red-500" />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-blue-500/60 uppercase flex items-center gap-1"><RiShieldLine/> Defensa</label>
                <input type="number" value={formData.defensa} onChange={(e)=>setFormData({...formData, defensa: +e.target.value})} className="w-full bg-black/60 p-4 rounded-xl text-white text-2xl font-mono text-center outline-none border border-white/5 focus:border-blue-500" />
            </div>
          </div>

          {/* URL Imagen */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><RiImageAddLine className="text-amber-500"/> URL del Arte Visual</label>
            <input 
              type="url" 
              value={formData.imagen} 
              onChange={(e)=>setFormData({...formData, imagen: e.target.value})} 
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-amber-500/50 transition-all font-mono text-sm" 
            />
          </div>

          {/* Habilidad Ultimate */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><RiFocus3Line className="text-amber-500"/> Habilidad Especial</label>
            <textarea 
              rows={3} 
              value={formData.habilidadUltimate} 
              onChange={(e)=>setFormData({...formData, habilidadUltimate: e.target.value})} 
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none resize-none focus:border-amber-500/50" 
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2"><RiHistoryLine className="text-amber-500"/> Historia / Lore</label>
            <textarea 
              rows={3} 
              value={formData.descripcion} 
              onChange={(e)=>setFormData({...formData, descripcion: e.target.value})} 
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none resize-none focus:border-amber-500/50" 
            />
          </div>

          {/* Botón Guardar */}
          <button 
            type="submit" 
            className="md:col-span-2 group relative w-full bg-amber-500 py-6 rounded-2xl transition-all duration-500 overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.2)]"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 text-black font-black uppercase italic tracking-tighter text-xl flex items-center justify-center gap-3">
              Guardar Cambios <RiSaveLine size={24} />
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditarCarta;