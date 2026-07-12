import { useState } from "react";
import { useNavigate, Link } from "react-router"; // Importamos Link
import { RiMagicLine, RiLoader4Line, RiCheckLine, RiArrowLeftLine } from "react-icons/ri";
import { API_URL } from "../App"; 

export const GeneradorIA = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusText, setStatusText] = useState("Generando carta con IA...");
  const navigate = useNavigate();

  const handleGenerateAndSave = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setStatusText("Generando carta con IA...");

    try {
      // 1. Llamada a la IA
      const resAi = await fetch(`${API_URL}/ai/generate-card`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "usersecretpasskey": "Leon422088LA" 
        },
        body: JSON.stringify({ 
          globalContext: "Temática Pokémon...", 
          cardPrompt: prompt 
        })
      });
      
      if (!resAi.ok) throw new Error("Error al consultar la IA");
      const aiData = await resAi.json();

      // 2. Guardar en la base de datos
      setStatusText("Guardando carta en la base de datos...");
      
      const resSave = await fetch(`${API_URL}/card`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "usersecretpasskey": "Leon422088LA" 
        },
        body: JSON.stringify({
          ...aiData,
          userSecret: "Leon422088LA" 
        })
      });

      if (resSave.ok) {
        setSuccess(true);
      } else {
        throw new Error("Error al guardar la carta en la DB");
      }
    } catch (err) {
      console.error("Error en el proceso:", err);
      setLoading(false);
      alert("Hubo un error al procesar la carta. Verifica la consola.");
    }
  };

  // VISTA DE ÉXITO (Sin timer, control manual)
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303] text-white">
        <div className="text-center animate-in fade-in zoom-in duration-500 p-6">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
            <RiCheckLine className="text-green-400 text-5xl" />
          </div>
          <h2 className="text-3xl font-black mb-2">¡CARTA CREADA!</h2>
          <p className="text-white/50 mb-8">La carta se ha generado y guardado correctamente.</p>
          
          <Link 
            to="/" 
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black font-black py-3 px-8 rounded-full transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // INTERFAZ DE GENERACIÓN
  return (
    <div className="min-h-screen bg-[#030303] p-6 md:p-12 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-4xl p-8">
        <button 
          onClick={() => navigate(-1)} 
          className="text-white/50 hover:text-white mb-6 flex items-center gap-2 transition-colors"
        >
          <RiArrowLeftLine /> Volver
        </button>
        
        <h1 className="text-2xl font-black text-cyan-400 mb-6 flex items-center gap-3 uppercase tracking-widest">
          <RiMagicLine /> Generador con IA
        </h1>

        <textarea
          className="w-full h-40 bg-black/50 border border-white/10 rounded-2xl p-4 text-white mb-6 outline-none focus:border-cyan-500 transition-all"
          placeholder="Describe el personaje o la carta que quieres crear..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleGenerateAndSave}
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RiLoader4Line className="animate-spin inline mr-2" /> 
              {statusText}
            </>
          ) : (
            "GENERAR Y GUARDAR"
          )}
        </button>
      </div>
    </div>
  );
};