import type { Carta } from "../types";

export const cartasGOH: Carta[] = [
  {
    id: 1,
    nombre: "Jin Mori",
    imagen: "https://i.pinimg.com/736x/8a/75/09/8a7509b72592884c71e10d6b24d367f2.jpg",
    descripcion: "La reencarnación del Rey Mono. Tras recuperar sus recuerdos divinos, su cuerpo alcanzó una resistencia que ignora las leyes de la física humana.",
    tipo: "Dios",
    hp: 9600,
    poder: 9850,
    defensa: 9700,
    habilidadUltimate: "Patada de Dragón Azul - Una técnica que manipula las corrientes de aire para invocar un dragón colosal",
    anime: "GOH"
  },
  {
    id: 2,
    nombre: "Han Daewi",
    imagen: "https://i.pinimg.com/1200x/0f/a8/65/0fa8654164eae5834d0e55e836b5b035.jpg",
    descripcion: "Heredero de la sabiduría del Sabio de Oriente. Controla las cuatro fuerzas fundamentales: gravedad, electromagnetismo, fuerza fuerte y débil.",
    tipo: "Luchador",
    hp: 9200,
    poder: 9100,
    defensa: 8900,
    habilidadUltimate: "Sabiduría del Sabio: Gravedad - Aplasta al oponente aumentando la presión atmosférica a niveles planetarios",
    anime: "GOH"
  },
];


export const cartasEjemplo: Carta[] = [
  ...cartasGOH,
];