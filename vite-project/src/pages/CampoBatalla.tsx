import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { RiSwordFill, RiHistoryFill, RiPlayFill, RiStopFill, RiFlagFill, RiTrophyFill, RiForbid2Line } from "react-icons/ri";
import type { Carta } from "../types/index";

type Props = {
  cartas: Carta[];
};

interface LogEntry {
  turno: number;
  mensaje: string;
  danio: number;
  vidaRestante: number;
}

function CampoBatalla({ cartas }: Props) {
  const { id1, id2 } = useParams();
  const navigate = useNavigate();
  
  // Usamos ReturnType para evitar el error de NodeJS.Timeout en navegadores con Vite
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- BUSCAR CARTAS EN EL MAZO GLOBAL ---
  const originalP1 = useMemo(() => cartas.find(c => c.id === Number(id1)), [cartas, id1]);
  const originalP2 = useMemo(() => cartas.find(c => c.id === Number(id2)), [cartas, id2]);

  // --- ESTADOS DE LA PELEA ---
  const [hp1, setHp1] = useState(0);
  const [hp2, setHp2] = useState(0);
  const [maxHp1, setMaxHp1] = useState(100);
  const [maxHp2, setMaxHp2] = useState(100);
  const [turno, setTurno] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [ganador, setGanador] = useState<string | null>(null);
  const [draw, setDraw] = useState(false);
  const [atacando, setAtacando] = useState<"p1" | "p2" | null>(null);
  const [autoBattle, setAutoBattle] = useState(false);

  // --- EXTRACCIÓN INTELIGENTE DE ESTADÍSTICAS (Anti-NaN & Case-Insensitive) ---
  const extractStat = (card: any, possibleKeys: string[]): number => {
    if (!card) return 0;
    
    // 1. Intento de búsqueda exacta
    for (const key of possibleKeys) {
      if (card[key] !== undefined && card[key] !== null) {
        const val = Number(card[key]);
        if (!isNaN(val)) return val;
      }
    }
    
    // 2. Intento de búsqueda ignorando mayúsculas/minúsculas
    const cardKeys = Object.keys(card);
    for (const key of possibleKeys) {
      const foundKey = cardKeys.find(k => k.toLowerCase() === key.toLowerCase());
      if (foundKey && card[foundKey] !== undefined && card[foundKey] !== null) {
        const val = Number(card[foundKey]);
        if (!isNaN(val)) return val;
      }
    }
    
    return 0;
  };

  // --- INICIALIZACIÓN DE LA BATALLA ---
  useEffect(() => {
    if (originalP1 && originalP2) {
      // Extraemos stats de Jugador 1
      let v1 = extractStat(originalP1, ['vida', 'hp', 'health']);
      let a1 = extractStat(originalP1, ['ataque', 'attack', 'atk', 'power']);
      let d1 = extractStat(originalP1, ['defensa', 'defense', 'def']);

      // Extraemos stats de Jugador 2
      let v2 = extractStat(originalP2, ['vida', 'hp', 'health']);
      let a2 = extractStat(originalP2, ['ataque', 'attack', 'atk', 'power']);
      let d2 = extractStat(originalP2, ['defensa', 'defense', 'def']);

      // --- VALORES DE RESPALDO (Evita que el juego se muera con cartas vacías) ---
      if (v1 <= 0) v1 = 100;
      if (v2 <= 0) v2 = 100;
      if (a1 <= 0) a1 = 15; // Daño base mínimo por si la API viene vacía
      if (a2 <= 0) a2 = 15;

      setMaxHp1(v1);
      setMaxHp2(v2);
      setHp1(v1);
      setHp2(v2);

      // Logs de debug en consola (F12) para que verifiques qué está leyendo
      console.log(`[COMBATE INICIADO]`);
      console.log(`${originalP1.nombre} -> HP: ${v1}, ATK: ${a1}, DEF: ${d1}`);
      console.log(`${originalP2.nombre} -> HP: ${v2}, ATK: ${a2}, DEF: ${d2}`);

      // --- DETECCION DE EMPATE TÉCNICO REAL ---
      // Ocurre solo si ambos ataques son incapaces de superar la defensa rival (daño = 0 mutuo)
      const p1NoDania = (a1 - d2) <= 0;
      const p2NoDania = (a2 - d1) <= 0;

      if (p1NoDania && p2NoDania) {
        console.warn("¡Empate Técnico detectado! Ningún luchador puede dañar al otro.");
        setDraw(true);
        setGameOver(true);
        setGanador("Empate Técnico");
      }
    }
  }, [originalP1, originalP2]);

  // --- CÁLCULO DE DAÑO Y TURNO ---
  const ejecutarTurno = () => {
    if (gameOver || atacando || !originalP1 || !originalP2) return;

    const esTurnoP1 = turno % 2 !== 0;
    const atacante = esTurnoP1 ? originalP1 : originalP2;
    const defensor = esTurnoP1 ? originalP2 : originalP1;
    const hpDefensorActual = esTurnoP1 ? hp2 : hp1;

    // Extraer estadísticas para la fórmula matemática
    let vAtaque = extractStat(atacante, ['ataque', 'attack', 'atk', 'power']);
    let vDefensa = extractStat(defensor, ['defensa', 'defense', 'def']);

    // Valores mínimos si la API no los tiene
    if (vAtaque <= 0) vAtaque = 15;

    // Fórmula del daño real (Lámina 3)
    const danio = Math.max(0, vAtaque - vDefensa);
    const nuevaVida = Math.max(0, hpDefensorActual - danio);

    // Activamos la animación de golpe en pantalla
    setAtacando(esTurnoP1 ? "p1" : "p2");

    // Registrar en el Log de batalla (Lámina 5)
    const nuevoLog: LogEntry = {
      turno,
      mensaje: `${atacante.nombre} golpea a ${defensor.nombre}`,
      danio,
      vidaRestante: nuevaVida
    };
    setLogs(prev => [nuevoLog, ...prev]);

    // Aplicar el daño justo en el momento del impacto visual
    setTimeout(() => {
      if (esTurnoP1) setHp2(nuevaVida);
      else setHp1(nuevaVida);

      // Verificar condición de victoria
      if (nuevaVida <= 0) {
        setGanador(atacante.nombre);
        setGameOver(true);
        setAutoBattle(false);
      }
      
      setAtacando(null);
      setTurno(prev => prev + 1);
    }, 300);
  };

  // --- SISTEMA DE AUTO-BATALLA ---
  useEffect(() => {
    if (autoBattle && !gameOver && !atacando) {
      timeoutRef.current = setTimeout(() => {
        ejecutarTurno();
      }, 700);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [autoBattle, turno, gameOver, atacando]);

  // Si no se encuentran las cartas (ej. recargas de página rápidas antes del fetch)
  if (!originalP1 || !originalP2) {
    return (
      <div className="min-h-screen bg-[#050505] text-cyan-400 p-20 flex flex-col items-center justify-center font-mono">
        <p className="animate-pulse tracking-widest text-sm mb-4">SINCRONIZANDO UNIDADES DE COMBATE...</p>
        <button onClick={() => navigate("/seleccionar-carta")} className="px-4 py-2 border border-cyan-500/30 hover:border-cyan-500 rounded-xl text-xs uppercase transition-all">
          Volver a Selección
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-mono p-4 md:p-8 flex flex-col selection:bg-cyan-500/30">
      
      {/* Header Estilo Cyberpunk */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl font-black italic text-cyan-400 tracking-tighter">ARENA_DE_COMBATE</h1>
          <p className="text-[10px] text-white/30 tracking-[0.3em] uppercase">SIMULACIÓN DE BATALLA // TURNO: {turno}</p>
        </div>
        <button 
          onClick={() => navigate("/seleccionar-carta")}
          className="text-[10px] bg-red-500/10 border border-red-500/40 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest"
        >
          <RiFlagFill className="inline mr-2" /> Rendirse
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 flex-grow">
        
        {/* ESCENARIO DE PELEA CENTRAL */}
        <div className="flex-grow flex items-center justify-around bg-white/[0.02] rounded-[3rem] border border-white/5 relative overflow-hidden p-6 shadow-inner">
          
          {/* Luchador 1 (Izquierda) */}
          <div className={`flex flex-col items-center transition-all duration-300 ${atacando === 'p1' ? 'animate-strike-p1' : ''}`}>
             <div className="w-48 mb-4 bg-slate-900 h-2 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-500" 
                  style={{width: `${(hp1 / maxHp1) * 100}%`}}
                ></div>
             </div>
             <div className={`p-2 border-2 rounded-[2.5rem] transition-all duration-500 ${turno % 2 !== 0 ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-transparent opacity-40 scale-95'}`}>
                <img src={originalP1.imagen} className="w-44 h-64 md:w-60 md:h-88 object-cover rounded-[2rem]" alt={originalP1.nombre} />
             </div>
             <p className="mt-4 font-black italic text-cyan-400 uppercase tracking-tight text-center">{originalP1.nombre}</p>
             <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">HP: {hp1} / {maxHp1}</p>
          </div>

          <div className="text-5xl font-black italic text-white/5 select-none animate-pulse">VS</div>

          {/* Luchador 2 (Derecha) */}
          <div className={`flex flex-col items-center transition-all duration-300 ${atacando === 'p2' ? 'animate-strike-p2' : ''}`}>
             <div className="w-48 mb-4 bg-slate-900 h-2 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="bg-red-500 h-full transition-all duration-500" 
                  style={{width: `${(hp2 / maxHp2) * 100}%`}}
                ></div>
             </div>
             <div className={`p-2 border-2 rounded-[2.5rem] transition-all duration-500 ${turno % 2 === 0 ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-transparent opacity-40 scale-95'}`}>
                <img src={originalP2.imagen} className="w-44 h-64 md:w-60 md:h-88 object-cover rounded-[2rem]" alt={originalP2.nombre} />
             </div>
             <p className="mt-4 font-black italic text-red-400 uppercase tracking-tight text-center">{originalP2.nombre}</p>
             <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">HP: {hp2} / {maxHp2}</p>
          </div>
        </div>

        {/* COLUMNA DE CONTROLES Y REGISTROS (LOGS) */}
        <div className="w-full lg:w-88 flex flex-col gap-6">
          
          {/* Panel de Botones de Control */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 shadow-xl">
            <button 
              onClick={ejecutarTurno}
              disabled={autoBattle || gameOver || !!atacando}
              className="w-full py-4 bg-white text-slate-950 font-black uppercase text-xs tracking-[0.2em] rounded-xl hover:bg-cyan-400 disabled:opacity-10 transition-all transform active:scale-95"
            >
              Siguiente Turno
            </button>
            <button 
              onClick={() => setAutoBattle(!autoBattle)}
              disabled={gameOver}
              className={`w-full py-4 font-black uppercase text-xs tracking-[0.2em] rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${autoBattle ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'}`}
            >
              {autoBattle ? <><RiStopFill className="text-lg" /> Detener</> : <><RiPlayFill className="text-lg" /> Auto Batalla</>}
            </button>
          </div>

          {/* Historial de la Batalla */}
          <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 flex flex-col overflow-hidden max-h-[350px] lg:max-h-none shadow-2xl">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
              <RiHistoryFill /> Registro_Eventos
            </h3>
            <div className="overflow-y-auto space-y-3 flex-grow pr-3 scrollbar-thin scrollbar-thumb-white/10">
              {logs.length === 0 ? (
                <p className="text-[10px] text-white/20 italic text-center py-10 tracking-widest">ESPERANDO INICIO DE COMBATE...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-[11px] border-l-2 border-cyan-500/30 pl-4 py-2 bg-white/[0.01] rounded-r-lg">
                    <span className="text-cyan-500 font-black">TURNO {log.turno}:</span> 
                    <p className="text-white/80 mt-1 uppercase tracking-tighter">{log.mensaje}</p> 
                    <span className="block text-white/30 font-mono mt-1">Impacto: -{log.danio} DMG (Quedan {log.vidaRestante} HP)</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE FINAL DE PARTIDA */}
      {gameOver && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-slate-900 border-2 border-cyan-500 rounded-[4rem] p-12 max-w-sm w-full text-center shadow-[0_0_80px_rgba(6,182,212,0.3)]">
            
            <div className="relative mb-6">
               {draw ? (
                 <RiForbid2Line className="text-7xl text-yellow-500 mx-auto" />
               ) : (
                 <RiTrophyFill className="text-7xl text-cyan-400 mx-auto animate-bounce" />
               )}
               <div className="absolute inset-0 bg-cyan-400 blur-3xl opacity-20 rounded-full"></div>
            </div>
            
            <h2 className="text-3xl font-black italic text-white uppercase mb-2 tracking-tighter">
              {draw ? "Combate Abortado" : "Simulación Completa"}
            </h2>
            
            <div className="bg-cyan-500/10 border border-cyan-500/30 py-4 px-6 rounded-2xl mb-8">
              <p className="text-[10px] text-cyan-400/60 uppercase tracking-[0.3em] mb-1">Resultado</p>
              <p className="text-xl font-black text-white uppercase italic">
                {draw ? "EMPATE TÉCNICO" : `GANADOR: ${ganador}`}
              </p>
            </div>

            {draw && (
              <p className="text-[10px] text-white/40 mb-6 leading-relaxed uppercase">
                Ninguna unidad posee suficiente ataque para superar la defensa del rival.
              </p>
            )}

            <button 
              onClick={() => navigate("/seleccionar-carta")}
              className="w-full py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl hover:bg-cyan-400 transition-all uppercase text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            >
              Nueva Simulación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampoBatalla;