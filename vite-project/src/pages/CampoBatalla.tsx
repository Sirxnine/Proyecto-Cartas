import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { RiHistoryFill, RiPlayFill, RiStopFill, RiFlagFill, RiTrophyFill, RiFlashlightFill } from "react-icons/ri";
import type { Carta } from "../types/index";

type Props = {
  cartas: Carta[];
};

interface LogEntry {
  turno: number;
  mensaje: string;
  danio: number;
  vidaRestante: number;
  fueCritico?: boolean;
  vidaAtacante?: number;
}

function CampoBatalla({ cartas }: Props) {
  const { id1, id2 } = useParams();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. SELECTORES DE UNIDADES DIRECTOS DE LA API
  const unidad1 = useMemo(() => cartas.find(c => String(c.id) === id1), [cartas, id1]);
  const unidad2 = useMemo(() => cartas.find(c => String(c.id) === id2), [cartas, id2]);

  // 2. ESTADOS DE LA SIMULACIÓN
  const [hp1, setHp1] = useState<number>(0);
  const [hp2, setHp2] = useState<number>(0);
  const [maxHp1, setMaxHp1] = useState<number>(100);
  const [maxHp2, setMaxHp2] = useState<number>(100);
  const [turno, setTurno] = useState<number>(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [ganador, setGanador] = useState<string | null>(null);
  const [atacando, setAtacando] = useState<"p1" | "p2" | null>(null);
  const [autoBattle, setAutoBattle] = useState<boolean>(false);
  const [velocidad, setVelocidad] = useState<number>(750);
  const [flashDamage, setFlashDamage] = useState<"p1" | "p2" | null>(null);

  // 3. EXTRACTOR INTELIGENTE DE ESTADÍSTICAS
  const getVal = (obj: any, keys: string[]): number => {
    if (!obj) return 0;
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null) return Number(obj[k]);
    }
    return 0;
  };

  // 4. FUNCIÓN DE SONIDO (OPCIONAL)
  const playSound = (type: 'attack' | 'critical' | 'victory'): void => {
    // Descomentar si tienes archivos de sonido
    // if (typeof window !== 'undefined') {
    //   const audio = new Audio(`/sounds/${type}.mp3`);
    //   audio.volume = 0.3;
    //   audio.play().catch(() => {});
    // }
  };

  // 5. VALIDACIÓN DE PARÁMETROS URL
  useEffect(() => {
    if (!id1 || !id2 || isNaN(Number(id1)) || isNaN(Number(id2))) {
      console.error('[ERROR] IDs inválidos');
      navigate('/seleccionar-carta');
    }
  }, [id1, id2, navigate]);

  // 6. INICIALIZADOR DE SISTEMA
  useEffect(() => {
    if (unidad1 && unidad2) {
      const v1 = getVal(unidad1, ['vida', 'hp', 'health']) || 100;
      const v2 = getVal(unidad2, ['vida', 'hp', 'health']) || 100;
      setHp1(v1);
      setHp2(v2);
      setMaxHp1(v1);
      setMaxHp2(v2);
      console.log(`[ARENA] Sincronizado: ${unidad1.nombre} vs ${unidad2.nombre}`);
    }
  }, [unidad1, unidad2]);

  // 7. PERSISTENCIA DE ESTADO
  useEffect(() => {
    if (!gameOver && (hp1 > 0 && hp2 > 0) && unidad1 && unidad2) {
      localStorage.setItem('batalla_actual', JSON.stringify({
        hp1, hp2, turno, logs, 
        unidad1Id: unidad1.id, 
        unidad2Id: unidad2.id,
        maxHp1, maxHp2
      }));
    }
  }, [hp1, hp2, turno, logs, gameOver, unidad1, unidad2, maxHp1, maxHp2]);

  // 8. MOTOR DE DAÑO CON SISTEMA DE CRÍTICOS
  const calcularDanio = (atacante: Carta, defensor: Carta): { danio: number; esCritico: boolean } => {
    const atk = getVal(atacante, ['ataque', 'attack', 'power', 'atk']) || 15;
    const def = getVal(defensor, ['defensa', 'defense', 'def']) || 0;
    let danio = Math.max(1, atk - def);
    
    // Daño mínimo de 5 para evitar combates eternos
    danio = Math.max(5, danio);
    
    // 15% de probabilidad de crítico (x1.5 daño)
    const esCritico = Math.random() < 0.15;
    if (esCritico) danio = Math.floor(danio * 1.5);
    
    return { danio, esCritico };
  };

  // 9. FLUJO DE TURNO MEJORADO
  const ejecutarTurno = (): void => {
    if (gameOver || atacando || !unidad1 || !unidad2) return;
    
    // Verificación extra de game over
    if (hp1 <= 0 || hp2 <= 0) {
      if (!gameOver) setGameOver(true);
      return;
    }

    const esP1 = turno % 2 !== 0;
    const atacante = esP1 ? unidad1 : unidad2;
    const defensor = esP1 ? unidad2 : unidad1;
    const hpActualDef = esP1 ? hp2 : hp1;

    const { danio, esCritico } = calcularDanio(atacante, defensor);
    const nuevaVida = Math.max(0, hpActualDef - danio);

    setAtacando(esP1 ? "p1" : "p2");
    
    // Efecto de flash de daño
    setFlashDamage(esP1 ? "p2" : "p1");
    setTimeout(() => setFlashDamage(null), 200);
    
    // Sonido según crítico
    if (esCritico) {
      playSound('critical');
    } else {
      playSound('attack');
    }

    const entry: LogEntry = {
      turno,
      mensaje: `${atacante.nombre} ataca a ${defensor.nombre}${esCritico ? ' 💥 ¡CRÍTICO!' : ''}`,
      danio,
      vidaRestante: nuevaVida,
      fueCritico: esCritico,
      vidaAtacante: esP1 ? hp1 : hp2
    };
    setLogs(prev => [entry, ...prev]);

    setTimeout(() => {
      if (esP1) setHp2(nuevaVida); else setHp1(nuevaVida);
      
      if (nuevaVida <= 0) {
        setGanador(atacante.nombre);
        setGameOver(true);
        setAutoBattle(false);
        playSound('victory');
      }
      setAtacando(null);
      setTurno(prev => prev + 1);
    }, 300);
  };

  // 10. AUTO-BATALLA CON VELOCIDAD CONFIGURABLE
  useEffect(() => {
    if (autoBattle && !gameOver && !atacando) {
      timeoutRef.current = setTimeout(ejecutarTurno, velocidad);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [autoBattle, turno, gameOver, atacando, velocidad]);

  // Validación de unidades
  if (!unidad1 || !unidad2) {
    return (
      <div className="min-h-screen bg-[#050505] p-20 font-mono text-cyan-400 flex flex-col items-center justify-center">
        <div className="animate-pulse text-2xl">⚔️ SINCRONIZANDO UNIDADES...</div>
        <p className="text-xs text-white/30 mt-4">
          {!unidad1 && !unidad2 && "Ambas unidades no encontradas"}
          {!unidad1 && unidad2 && `Unidad ${id1} no encontrada`}
          {unidad1 && !unidad2 && `Unidad ${id2} no encontrada`}
        </p>
        <button 
          onClick={() => navigate("/seleccionar-carta")} 
          className="mt-8 px-6 py-2 border border-cyan-500/40 text-cyan-400 text-xs rounded-lg hover:bg-cyan-500/10"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-mono p-6">
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
        
        .animate-strike-p1 {
          animation: strikeP1 0.3s ease-in-out;
        }
        
        .animate-strike-p2 {
          animation: strikeP2 0.3s ease-in-out;
        }
        
        .flash-damage {
          animation: damageFlash 0.2s ease-in-out 2;
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
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6,182,212,0.8);
        }
        
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fadeIn;
        }
        
        .zoom-in-95 {
          animation-name: zoomIn;
        }
      `}</style>
      
      <header className="mb-10 flex justify-between items-center border-b border-white/5 pb-4 flex-wrap gap-4">
        <h1 className="text-xl font-black italic text-cyan-400">ARENA_BATALLA_V2</h1>
        <div className="flex gap-3 items-center">
          {/* Control de velocidad */}
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
            <RiFlashlightFill className="text-yellow-500 text-xs" />
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
          <button 
            onClick={() => navigate("/seleccionar-carta")} 
            className="px-4 py-2 border border-red-500/40 text-red-500 text-[10px] rounded-lg hover:bg-red-500/10 transition-all uppercase"
          >
            <RiFlagFill className="inline mr-2" /> Rendirse
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow flex items-center justify-around bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 relative">
          {/* Jugador 1 */}
          <div className={`flex flex-col items-center transition-all ${atacando === 'p1' ? 'animate-strike-p1' : ''}`}>
             <div className="w-40 mb-4 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full transition-all duration-500" style={{width: `${(hp1 / (maxHp1 || 100)) * 100}%`}}></div>
             </div>
             <div className={`p-2 border-2 rounded-[2.5rem] transition-all ${turno % 2 !== 0 ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-transparent opacity-40'} ${flashDamage === 'p1' ? 'flash-damage' : ''}`}>
                <img src={unidad1.imagen} className="w-56 h-80 object-cover rounded-[2rem]" alt={unidad1.nombre} />
             </div>
             <p className="mt-4 font-black italic text-cyan-400 uppercase">{unidad1.nombre}</p>
             <p className="text-xs text-white/40 mt-1">❤️ {hp1}/{maxHp1}</p>
          </div>

          <span className="text-4xl font-black italic opacity-10">VS</span>

          {/* Jugador 2 */}
          <div className={`flex flex-col items-center transition-all ${atacando === 'p2' ? 'animate-strike-p2' : ''}`}>
             <div className="w-40 mb-4 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full transition-all duration-500" style={{width: `${(hp2 / (maxHp2 || 100)) * 100}%`}}></div>
             </div>
             <div className={`p-2 border-2 rounded-[2.5rem] transition-all ${turno % 2 === 0 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-transparent opacity-40'} ${flashDamage === 'p2' ? 'flash-damage' : ''}`}>
                <img src={unidad2.imagen} className="w-56 h-80 object-cover rounded-[2rem]" alt={unidad2.nombre} />
             </div>
             <p className="mt-4 font-black italic text-red-400 uppercase">{unidad2.nombre}</p>
             <p className="text-xs text-white/40 mt-1">❤️ {hp2}/{maxHp2}</p>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4">
            <button 
              onClick={ejecutarTurno} 
              disabled={autoBattle || gameOver || !!atacando} 
              className="w-full py-4 bg-white text-black font-black uppercase text-xs rounded-xl hover:bg-cyan-400 disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Siguiente Turno
            </button>
            <button 
              onClick={() => setAutoBattle(!autoBattle)} 
              disabled={gameOver} 
              className="w-full py-4 border border-cyan-500 text-cyan-400 font-black uppercase text-xs rounded-xl hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {autoBattle ? (
                <span className="flex items-center gap-1"><RiStopFill /> Detener</span>
              ) : (
                <span className="flex items-center gap-1"><RiPlayFill /> Auto Batalla</span>
              )}
            </button>
          </div>

          <div className="flex-grow bg-white/2 border border-white/5 rounded-[2rem] p-6 flex flex-col overflow-hidden max-h-[350px]">
            <h4 className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><RiHistoryFill /> Registro de Batalla</h4>
            <div className="overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-[10px] text-white/10 italic py-10 text-center">ESPERANDO COMBATE...</p>
              ) : (
                logs.map((l, index) => (
                  <div key={`log-${l.turno}-${index}`} className="text-[10px] border-l border-white/10 pl-3 py-1 hover:bg-white/5 transition-all">
                    <span className="text-cyan-500 font-bold">T{l.turno}:</span> {l.mensaje} 
                    <span className={`block text-xs mt-0.5 ${l.fueCritico ? 'text-yellow-500' : 'text-white/40'}`}>
                      💔 Impacto: -{l.danio} DMG {l.fueCritico && '✨ ¡CRÍTICO!'}
                    </span>
                    <span className="block text-white/20 text-[8px]">❤️ Vida restante: {l.vidaRestante}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {gameOver && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-[4rem] p-12 text-center shadow-[0_0_50px_rgba(6,182,212,0.4)] animate-in zoom-in-95">
             <RiTrophyFill className="text-7xl text-cyan-400 mx-auto mb-4 animate-bounce" />
             <h2 className="text-2xl font-black italic text-white mb-2 uppercase tracking-tighter">🏆 ¡VICTORIA PARA {ganador?.toUpperCase()}! 🏆</h2>
             <p className="text-white/40 text-xs mt-2">Batalla completada en {turno} turnos</p>
             <div className="flex gap-4 justify-center mt-8">
               <button 
                 onClick={() => {
                   // Reiniciar la misma batalla
                   if (unidad1 && unidad2) {
                     const v1 = getVal(unidad1, ['vida', 'hp', 'health']) || 100;
                     const v2 = getVal(unidad2, ['vida', 'hp', 'health']) || 100;
                     setHp1(v1);
                     setHp2(v2);
                     setMaxHp1(v1);
                     setMaxHp2(v2);
                     setTurno(1);
                     setLogs([]);
                     setGameOver(false);
                     setGanador(null);
                     setAutoBattle(false);
                   }
                 }} 
                 className="px-6 py-2 border border-cyan-500 text-cyan-400 font-black rounded-xl hover:bg-cyan-500/10 transition-all uppercase text-xs cursor-pointer"
               >
                 Revancha
               </button>
               <button 
                 onClick={() => navigate("/seleccionar-carta")} 
                 className="px-6 py-2 bg-cyan-500 text-slate-950 font-black rounded-xl hover:bg-cyan-400 transition-all uppercase text-xs cursor-pointer"
               >
                 Nueva Simulación
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampoBatalla;