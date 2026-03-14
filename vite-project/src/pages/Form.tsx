import { useState } from "react";
import { 
  RiAddLine, 
  RiImageAddLine, 
  RiShieldLine, 
  RiSwordLine, 
  RiHistoryLine, 
  RiLoader4Line,
  RiCheckLine,
  RiErrorWarningLine 
} from "react-icons/ri";
import { BsFeather } from "react-icons/bs";
import { useNavigate } from 'react-router';
import type { Carta } from "../types";

interface FormularioCartaProps {
  onCrear: (carta: Carta) => Promise<{ success: boolean; error?: any }>;
  loading?: boolean;
}

const FormularioCarta = ({ onCrear, loading = false }: FormularioCartaProps) => {
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

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'poder' || name === 'defensa' || name === 'hp' ? Number(value) : value
    }));
    // Limpiar error cuando el usuario empieza a escribir
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (formData.poder < 0 || formData.poder > 99999) {
      setError("El poder debe estar entre 0 y 99999");
      return false;
    }
    if (formData.defensa < 0 || formData.defensa > 99999) {
      setError("La defensa debe estar entre 0 y 99999");
      return false;
    }
    if (formData.hp < 0 || formData.hp > 99999) {
      setError("Los puntos de vida deben estar entre 0 y 99999");
      return false;
    }
    if (!formData.habilidadUltimate.trim()) {
      setError("La habilidad ultimate es obligatoria");
      return false;
    }
    if (!formData.descripcion.trim()) {
      setError("La descripción es obligatoria");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    // Creamos el objeto con la estructura correcta
    const nuevaCarta: Carta = {
      id: Date.now(), // ID temporal (la API asignará uno real)
      nombre: formData.nombre.trim(),
      poder: Number(formData.poder),
      defensa: Number(formData.defensa),
      hp: Number(formData.hp),
      imagen: formData.imagen.trim() || "https://via.placeholder.com/400x600?text=Sin+Imagen",
      descripcion: formData.descripcion.trim(),
      tipo: formData.tipo,
      habilidadUltimate: formData.habilidadUltimate.trim()
    };

    try {
      const result = await onCrear(nuevaCarta);
      
      if (result.success) {
        setSuccess(true);
        // Pequeña pausa para mostrar el éxito antes de navegar
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError("Error al crear la carta. Intenta de nuevo.");
      }
    } catch (err) {
      setError("Error de conexión. Verifica tu internet.");
      console.error("Error en submit:", err);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  // Si la creación fue exitosa, mostramos mensaje de éxito
  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
            <RiCheckLine className="text-green-400 text-5xl" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">¡CARTA CREADA!</h2>
          <p className="text-green-400/70">Redirigiendo al inicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 overflow-hidden bg-[#030303]">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Tarjeta del Formulario */}
      <div className="relative z-10 w-full max-w-4xl bg-white/3 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        
        {/* Adorno de esquina */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-[2.5rem] pointer-events-none" />

        {/* Header */}
        <header className="mb-12 relative">
          <div className="flex items-center gap-5 mb-4">
            <div className="h-12 w-1.5 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
              Crea tu <span className="text-cyan-400">Carta</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-white/40 font-mono text-[9px] tracking-[0.4em] uppercase">
            <span>Protocolo: V-Series_01</span>
            <span className="h-px w-20 bg-white/10" />
            <span className="flex items-center gap-1 text-cyan-400/60">
              <BsFeather /> Sistema Online
            </span>
          </div>
        </header>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
            <RiErrorWarningLine className="text-red-500 text-xl flex-shrink-0" />
            <p className="text-red-400 text-sm font-mono">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          
          {/* Nombre */}
          <div className="group space-y-2 md:col-span-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
              Nombre del Personaje <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Ej: Pegasus Seiya"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:bg-cyan-500/5 outline-none transition-all italic font-semibold shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Tipo */}
          <div className="group space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
              Tipo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white focus:border-cyan-500/50 outline-none transition-all cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="Luchador">Luchador</option>
                <option value="Estratega">Estratega</option>
                <option value="Mago">Mago</option>
                <option value="Ninja">Ninja</option>
                <option value="Dios">Dios</option>
                <option value="Tanque">Tanque</option>
                <option value="Espadachin">Espadachin</option>
                <option value="Asesino">Asesino</option>
                <option value="Héroe">Héroe</option>
                <option value="Villano">Villano</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500">
                ▼
              </div>
            </div>
          </div>

          {/* Anime (opcional) - lo dejamos para futura expansión */}
          <div className="group space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-cyan-400 transition-colors">
              Anime / Saga (opcional)
            </label>
            <input
              type="text"
              name="anime"
              placeholder="Ej: Dragon Ball Super"
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white placeholder-white/30 focus:border-cyan-500/50 focus:bg-cyan-500/5 outline-none transition-all italic disabled:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Stats Grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-linear-to-br from-white/2 to-transparent p-8 rounded-4xl border border-white/5 relative overflow-hidden">
            
            {/* HP */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-green-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiShieldLine /> Vitalidad (HP) <span className="text-red-500">*</span>
              </div>
              <input
                type="number"
                name="hp"
                required
                min="0"
                max="99999"
                value={formData.hp}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/60 border border-green-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-green-500 transition-all outline-none disabled:opacity-50"
              />
            </div>

            {/* Ataque */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-red-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiSwordLine /> Ataque <span className="text-red-500">*</span>
              </div>
              <input
                type="number"
                name="poder"
                required
                min="0"
                max="99999"
                value={formData.poder}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/60 border border-red-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-red-500 transition-all outline-none disabled:opacity-50"
              />
            </div>

            {/* Defensa */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2 text-blue-500/80 font-black italic text-xs tracking-tighter uppercase">
                <RiShieldLine /> Defensa <span className="text-red-500">*</span>
              </div>
              <input
                type="number"
                name="defensa"
                required
                min="0"
                max="99999"
                value={formData.defensa}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/60 border border-blue-500/20 p-4 rounded-xl text-white text-2xl font-mono focus:border-blue-500 transition-all outline-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* URL de la Imagen */}
          <div className="md:col-span-2 group space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest group-focus-within:text-cyan-400">
              URL de la Imagen
            </label>
            <div className="relative">
              <RiImageAddLine className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 text-xl" />
              <input
                type="url"
                name="imagen"
                placeholder="https://ejemplo.com/imagen.jpg (opcional)"
                value={formData.imagen}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-black/40 border border-white/10 pl-12 p-4 rounded-2xl text-white placeholder-white/30 focus:border-cyan-500/50 outline-none transition-all disabled:opacity-50"
              />
            </div>
            <p className="text-[8px] text-white/20 font-mono mt-1">
              Si no se proporciona, se usará una imagen por defecto
            </p>
          </div>

          {/* Habilidad Ultimate */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
              <RiAddLine /> Habilidad Ultimate <span className="text-red-500">*</span>
            </label>
            <textarea
              name="habilidadUltimate"
              required
              rows={3}
              value={formData.habilidadUltimate}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ej: Explosión Final Galáctica - Un ataque que destruye galaxias enteras"
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white placeholder-white/30 focus:border-cyan-500/50 outline-none resize-none disabled:opacity-50"
            />
          </div>

          {/* Descripción / Lore */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
              <RiHistoryLine /> Lore / Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              required
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
              disabled={loading}
              placeholder="Historia del personaje, origen, poderes..."
              className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white placeholder-white/30 focus:border-cyan-500/50 outline-none resize-none disabled:opacity-50"
            />
          </div>

          {/* Botones */}
          <div className="md:col-span-2 pt-6 flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="group relative flex-1 bg-white/5 hover:bg-white/10 py-6 rounded-2xl transition-all duration-500 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 text-white/70 font-black uppercase italic tracking-tighter text-xl">
                Cancelar
              </span>
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`group relative flex-1 py-6 rounded-2xl transition-all duration-500 overflow-hidden ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.25)]'
              }`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative z-10 text-black font-black uppercase italic tracking-tighter text-xl flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <RiLoader4Line className="animate-spin text-2xl" />
                    CREANDO CARTA...
                  </>
                ) : (
                  <>
                    Crear Carta <RiAddLine className="text-2xl" />
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Campos requeridos hint */}
          <div className="md:col-span-2 text-right">
            <p className="text-[8px] text-white/20 font-mono">
              <span className="text-red-500">*</span> Campos obligatorios
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCarta;