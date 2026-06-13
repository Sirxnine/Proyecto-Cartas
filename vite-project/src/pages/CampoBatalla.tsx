import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import type { Carta } from "../types/index";

// --- TIPOS ---
interface LogEntry {
  turno: number;
  atacante: string;
  defensor: string;
  danio: number;
  vidaRestante: number;
  fueCritico?: boolean;
}

function CampoBatalla({ cartas }: { cartas: Carta[] }) {
  const { id1, id2 } = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // --- ESTADOS (CORREGIDOS) ---
  const [p1, setP1] = useState<Carta | null>(null);
  const [p2, setP2] = useState<Carta | null>(null);
  const [turno, setTurno] = useState<number>(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const [autoBattle, setAutoBattle] = useState<boolean>(false);
  const [animating, setAnimating] = useState<"p1" | "p2" | null>(null);
  const [velocidad, setVelocidad] = useState<number>(750);
  const [flashDamage, setFlashDamage] = useState<"p1" | "p2" | null>(null);

  // Limpiar montaje
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // --- CARGA DE CARTAS CON VALIDACIÓN ---
  useEffect(() => {
    if (!id1 || !id2 || isNaN(Number(id1)) || isNaN(Number(id2))) {
      console.error('[ERROR] IDs inválidos');
      navigate('/');
      return;
    }

    const carta1 = cartas.find(c => String(c.id) === id1);
    const carta2 = cartas.find(c => String(c.id) === id2);

    if (carta1 && carta2) {
      setP1({ ...carta1 });
      setP2({ ...carta2 });

      const p1PuedeDanar = carta1.poder > carta2.defensa;
      const p2PuedeDanar = carta2.poder > carta1.defensa;

      if (!p1PuedeDanar && !p2PuedeDanar) {
        setDraw(true);
        setGameOver(true);
      }
    } else {
      console.error('[ERROR] Una o ambas cartas no encontradas');
      navigate('/');
    }
  }, [id1, id2, cartas, navigate]);

  // --- LÓGICA DE COMBATE CON CRÍTICOS ---
  const calcularDanio = (atk: number, def: number): { danio: number; esCritico: boolean } => {
    let danio = Math.max(1, atk - def);
    danio = Math.max(5, danio);
    const esCritico = Math.random() < 0.15;
    if (esCritico) danio = Math.floor(danio * 1.5);
    return { danio, esCritico };
  };

  const ejecutarAtaque = () => {
    if (!p1 || !p2 || gameOver) return true;

    const esTurnoP1 = turno % 2 !== 0;
    const atacante = esTurnoP1 ? p1 : p2;
    const defensor = esTurnoP1 ? p2 : p1;

    const { danio, esCritico } = calcularDanio(atacante.poder, defensor.defensa);
    const nuevaVida = Math.max(0, defensor.hp - danio);

    // Animaciones
    setAnimating(esTurnoP1 ? "p1" : "p2");
    setFlashDamage(esTurnoP1 ? "p2" : "p1");

    setTimeout(() => {
      if (isMountedRef.current) {
        setFlashDamage(null);
      }
    }, 200);

    // Actualizar estado del defensor
    if (esTurnoP1) {
      setP2({ ...p2, hp: nuevaVida });
    } else {
      setP1({ ...p1, hp: nuevaVida });
    }

    // Guardar Log
    const nuevoLog: LogEntry = {
      turno,
      atacante: atacante.nombre,
      defensor: defensor.nombre,
      danio,
      vidaRestante: nuevaVida,
      fueCritico: esCritico
    };
    setLogs(prev => [nuevoLog, ...prev]);

    // Verificar Victoria
    if (nuevaVida <= 0) {
      setWinner(esTurnoP1 ? "p1" : "p2");
      setGameOver(true);
      setAutoBattle(false);
      return true;
    }
    return false;
  };

  const siguienteTurno = () => {
    if (animating || gameOver || !isMountedRef.current) return;

    const terminado = ejecutarAtaque();
    if (!terminado) {
      setTimeout(() => {
        if (isMountedRef.current) {
          setAnimating(null);
          setTurno(t => t + 1);
        }
      }, 300);
    } else {
      setTimeout(() => {
        if (isMountedRef.current) {
          setAnimating(null);
        }
      }, 300);
    }
  };

  // --- AUTO BATALLA CORREGIDA ---
  useEffect(() => {
    if (autoBattle && !gameOver && !animating && isMountedRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        if (isMountedRef.current && autoBattle && !gameOver && !animating) {
          siguienteTurno();
        }
      }, velocidad);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [autoBattle, turno, gameOver, animating, velocidad]);

  // --- REVANCHA ---
  const handleRematch = () => {
    if (p1 && p2 && isMountedRef.current) {
      const cartaOriginal1 = cartas.find(c => c.id === p1.id);
      const cartaOriginal2 = cartas.find(c => c.id === p2.id);

      if (cartaOriginal1 && cartaOriginal2) {
        setP1({ ...cartaOriginal1 });
        setP2({ ...cartaOriginal2 });
        setTurno(1);
        setLogs([]);
        setGameOver(false);
        setWinner(null);
        setDraw(false);
        setAutoBattle(false);
        setAnimating(null);
        setFlashDamage(null);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }
  };

  if (!p1 || !p2) {
    return (
      <div className="min-h-screen bg-[#050507] text-white p-20 font-mono flex flex-col items-center justify-center">
        <div className="animate-pulse text-2xl text-cyan-400">⚔️ CARGANDO ARENA...</div>
        <button
          onClick={() => navigate("/")}
          className="mt-8 px-6 py-2 border border-cyan-500/40 text-cyan-400 text-xs rounded-lg hover:bg-cyan-500/10"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white p-8 font-mono overflow-hidden">
      <style>{`
        @keyframes strikeP1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(20px); }
        }
        
        @keyframes strikeP2 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-20px); }
        }
        
        @keyframes damageFlash {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.5) saturate(2); }
        }
        
        @keyframes criticalHit {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); text-shadow: 0 0 20px rgba(234,179,8,0.8); }
        }
        
        .animate-strike-p1 {
          animation: strikeP1 0.3s ease-in-out;
        }
        
        .animate-strike-p2 {
          animation: strikeP2 0.3s ease-in-out;
        }
        
        .flash-damage {
          animation: damageFlash 0.2s ease-in-out 2;
        }
        
        .critical-text {
          animation: criticalHit 0.5s ease-in-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6,182,212,0.5);
          border-radius: 10px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fadeIn;
        }
        
        .zoom-in {
          animation-name: zoomIn;
        }
      `}</style>

      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="w-24"></div>
          <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
            ARENA {turno}
          </h1>
          <div className="flex gap-2 items-center bg-black/30 px-3 py-1 rounded-full">
            <span className="text-yellow-500 text-xs">⚡</span>
            <select
              value={velocidad}
              onChange={(e) => setVelocidad(Number(e.target.value))}
              className="bg-black/50 text-cyan-400 text-xs p-1 rounded border border-cyan-500/30 cursor-pointer"
              disabled={autoBattle}
            >
              <option value={1000}>🐢 Lenta</option>
              <option value={750}>⚡ Normal</option>
              <option value={400}>🚀 Rápida</option>
            </select>
          </div>
        </div>
        {autoBattle && (
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 px-4 py-1 rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-yellow-500 text-xs font-bold uppercase tracking-wider">MODO AUTO ACTIVO</span>
          </div>
        )}
      </div>

      {/* CAMPO DE BATALLA */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* P1 CARD */}
        <div className={`md:col-span-4 transition-all duration-300 ${animating === 'p1' ? 'animate-strike-p1' : ''} ${flashDamage === 'p1' ? 'flash-damage' : ''}`}>
          <div className="relative group">
            <div className={`absolute -inset-1 bg-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition ${turno % 2 !== 0 && !gameOver ? 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' : ''}`}></div>
            <div className="relative bg-zinc-900 border-2 border-cyan-500/50 p-4 rounded-2xl shadow-2xl">
              <img src={p1.imagen} className="w-full h-80 object-cover rounded-xl mb-4 border border-white/10" alt={p1.nombre} />
              <h2 className="text-2xl font-black uppercase text-cyan-400 italic">{p1.nombre}</h2>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-black rounded-full border border-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500" style={{ width: `${(p1.hp / (cartas.find(c => c.id === p1.id)!.hp)) * 100}%` }}></div>
                </div>
                <div className="flex justify-between font-bold text-xs">
                  <span className="flex items-center gap-1">❤️ {p1.hp} HP</span>
                  <span className="text-zinc-500 flex gap-2">
                    <span>⚔️ {p1.poder}</span>
                    <span>🛡️ {p1.defensa}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLES CENTRALES */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <button
            onClick={siguienteTurno}
            disabled={gameOver || !!animating || autoBattle}
            className="py-4 bg-gradient-to-r from-white to-gray-200 text-black font-black uppercase rounded-xl hover:from-cyan-400 hover:to-cyan-300 transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transform hover:scale-105 active:scale-95"
          >
            ⚔️ ATACAR ⚔️
          </button>
          <button
            onClick={() => setAutoBattle(!autoBattle)}
            disabled={gameOver}
            className="py-4 border-2 border-yellow-500 text-yellow-500 font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-500/10 transition-all cursor-pointer disabled:opacity-50"
          >
            {autoBattle ? (
              <>⏹️ Detener</>
            ) : (
              <>▶️ Auto Batalla</>
            )}
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-zinc-500 text-xs hover:text-red-500 transition-all flex items-center justify-center gap-1"
          >
            🏳️ Rendirse
          </button>
        </div>

        {/* P2 CARD */}
        <div className={`md:col-span-4 transition-all duration-300 ${animating === 'p2' ? 'animate-strike-p2' : ''} ${flashDamage === 'p2' ? 'flash-damage' : ''}`}>
          <div className="relative group">
            <div className={`absolute -inset-1 bg-red-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition ${turno % 2 === 0 && !gameOver ? 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' : ''}`}></div>
            <div className="relative bg-zinc-900 border-2 border-red-500/50 p-4 rounded-2xl shadow-2xl">
              <img src={p2.imagen} className="w-full h-80 object-cover rounded-xl mb-4 border border-white/10" alt={p2.nombre} />
              <h2 className="text-2xl font-black uppercase text-red-400 italic">{p2.nombre}</h2>
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-black rounded-full border border-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500" style={{ width: `${(p2.hp / (cartas.find(c => c.id === p2.id)!.hp)) * 100}%` }}></div>
                </div>
                <div className="flex justify-between font-bold text-xs">
                  <span className="flex items-center gap-1">❤️ {p2.hp} HP</span>
                  <span className="text-zinc-500 flex gap-2">
                    <span>⚔️ {p2.poder}</span>
                    <span>🛡️ {p2.defensa}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOGS HISTORIAL */}
      <div className="max-w-4xl mx-auto mt-12 bg-black/40 border border-white/5 rounded-2xl p-6">
        <h3 className="text-zinc-500 uppercase text-xs mb-4 flex items-center gap-2">📜 Historial de Combate</h3>
        <div className="h-40 overflow-y-auto space-y-2 pr-4 custom-scrollbar">
          {logs.map((log, i) => (
            <div key={`log-${log.turno}-${i}`} className={`text-xs border-b border-white/5 pb-1 flex justify-between items-center hover:bg-white/5 p-1 rounded transition-all ${log.fueCritico ? 'critical-text' : ''}`}>
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-zinc-600 font-mono">[{log.turno}]</span>
                <span className="text-cyan-400">{log.atacante}</span>
                <span className="text-zinc-600">→</span>
                <span className="text-red-400">{log.defensor}</span>
              </div>
              <div className="flex gap-3 items-center flex-wrap">
                {log.fueCritico && <span className="text-yellow-500 text-[10px] font-bold animate-pulse">✨ CRÍTICO!</span>}
                <span className="text-red-500 font-bold">-{log.danio} HP</span>
                <span className="text-zinc-600 text-[10px]">❤️ {log.vidaRestante}</span>
              </div>
            </div>
          ))}
          {logs.length === 0 && <p className="text-zinc-700 text-center py-4">Esperando primer golpe...</p>}
        </div>
      </div>

      {/* MODALES DE FIN */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-yellow-500/50 p-12 rounded-[3rem] text-center max-w-lg shadow-2xl animate-in zoom-in duration-300">
            {draw ? (
              <>
                <div className="text-6xl text-zinc-500 mx-auto mb-4">🤝</div>
                <h2 className="text-4xl font-black italic mb-4 uppercase bg-gradient-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent">Empate Técnico</h2>
                <p className="text-zinc-400 mb-8">Ningún jugador puede dañar al otro. El combate es un punto muerto.</p>
              </>
            ) : (
              <>
                <div className="text-7xl text-yellow-500 mx-auto mb-4 animate-bounce">🏆</div>
                <h2 className="text-4xl font-black italic mb-4 uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">¡Victoria!</h2>
                <p className="text-2xl text-yellow-400 font-bold mb-4">{winner === 'p1' ? p1.nombre : p2.nombre} ha triunfado.</p>
                <p className="text-zinc-500 text-sm">Batalla completada en {turno} turnos</p>
              </>
            )}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleRematch}
                className="flex-1 py-3 border-2 border-cyan-500 text-cyan-400 font-black rounded-xl hover:bg-cyan-500/10 transition-all uppercase text-xs"
              >
                Revancha
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 py-3 bg-white text-black font-black rounded-xl hover:bg-yellow-500 transition-colors uppercase text-xs"
              >
                Volver al Mazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampoBatalla;