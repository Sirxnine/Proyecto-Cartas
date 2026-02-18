import { useState } from "react";
import {RiAddLine, RiImageAddLine} from "react-icons/ri";
import { BsFeather } from "react-icons/bs";

const FormularioCarta = ({onCrear}: {onCrear: (carta: any) => void}) => {
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: '',
        poder: 0,
        defensa: 0,
        habilidadUltimate: '',
        descripcion: '',
        imagen: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCrear({...formData, id: Date.now()});
        setFormData({
            nombre: '',
            tipo: '',
            poder: 0,
            defensa: 0,
            habilidadUltimate: '',
            descripcion: '',
            imagen: ''
        });
    };
    
    return (

        <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl p-8 rounded-4x1 border border-white/10 shadow-2xl mb-12">
            <div className="flex items-center gap-3 mb-8">
                <RiAddLine className="text-cyan-400 text-3xl" />
                <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">
                Crear Nueva <span className="text-cyan-400">Carta <BsFeather /></span>
                </h2>
        </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Input Para el Nombre */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre</label>
                <input
                type="text"
                required
                placeholder = "Seiya"
                value={formData.nombre} 
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all italic"
                />
            </div>
        {/* Input Para el Tipo */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Tipo</label>
                <select 
                value={formData.tipo}
                onChange = {(e) => setFormData({...formData, tipo: e.target.value})}
                className="bg-[#1a1a1a] border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                >
                    <option value="Luchador">Luchador</option>
                    <option value="Estratega">Estratega</option>
                    <option value="Mago">Mago</option>
                    <option value="Ninja">Ninja</option>
                    <option value="Dios">Dios</option>
                    <option value="Tanque">Tanque</option>
                    <option value="Caballero">Caballero</option>
                    <option value="Espadachin">Espadachin</option>
                    <option value="Monarca">Monarca</option>
                    <option value="Hechicero">Hechicero</option>
                    <option value="Invocador">Invocador</option>
                    <option value="Maldicion">Maldicion</option>
                    <option value="Saiyajin">Saiyajin</option>
                    <option value="Pirata">Pirata</option>
                    <option value="Heroe">Heroe</option>
                </select>
            </div>
        {/* Input Para el Poder */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Poder</label>
                <input
                type = "number"
                required
                placeholder = "1000"
                value={formData.poder}
                onChange={(e)=> setFormData({...formData, poder: Number(e.target.value)})}
                className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none" 
                />
            </div>
        {/* Input Para la Defensa */}
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Defensa</label>
                <input
                type = "number"
                required
                placeholder = "1000"
                value={formData.defensa}
                onChange={(e)=> setFormData({...formData, defensa: Number(e.target.value)})}
                className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none" 
                />
            </div>
            {/* Input Para la Imagen */}
            <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">URL de la Imagen</label>
                <div className="relative">
                <RiImageAddLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                type="text"
                placeholder="https://Batman.jpg"
                value={formData.imagen}
                onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                className="bg-white/5 border border-white/10 pl-10 p-3 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all italic w-full"
                />
                </div>
            </div>
            {/* Input para la Ultimate */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Directiva Ultimate</label>
          <textarea 
            rows={2}
            placeholder="Describe el ataque definitivo..."
            value={formData.habilidadUltimate}
            onChange={(e) => setFormData({...formData, habilidadUltimate: e.target.value})}
            className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
          />
        </div>
        
        {/* Input para la Descripcion */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descripción</label>
          <textarea 
            rows={2}
            placeholder="Describe la carta..."
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            className="bg-white/5 border border-white/10 p-3 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
          />
        </div>

        {/* Botón */}
        <button 
          type="submit"
          className="md:col-span-2 mt-40 bg-cyan-60 hover:bg-cyan-500 text-black font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] uppercase italic tracking-tighter"
        >
          Registrar Carta
        </button>
            </form>
        </div>
    )

}

export default FormularioCarta;

