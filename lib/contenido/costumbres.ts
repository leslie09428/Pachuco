/**
 * Costumbres, música y vida social del mundo pachuco.
 */

export interface BloqueCostumbre {
  titulo: string;
  texto: string;
  icono: string;
}

export const costumbres: BloqueCostumbre[] = [
  {
    titulo: "El dance y el swing",
    icono: "🎷",
    texto:
      "La vida pachuca giraba en torno al baile. En salones y auditorios sonaban las big bands y el jazz, y los jóvenes bailaban jitterbug con vueltas, saltos y acrobacias. El dance era el lugar para verse, competir en estilo, enamorarse y hacer comunidad.",
  },
  {
    titulo: "La elegancia como respeto",
    icono: "🎩",
    texto:
      "Vestirse bien era una ética: el traje se planchaba con cuidado, los zapatos se lustraban y el sombrero se llevaba con etiqueta. En un mundo que los trataba como inferiores, la elegancia era una respuesta: dignidad que se llevaba puesta.",
  },
  {
    titulo: "La calle y el barrio",
    icono: "🏘️",
    texto:
      "El barrio era el salón de la casa grande: las cornisas, las esquinas y los portales eran lugar de conversación, música y broma. Hablar caló en la calle era el idioma de la confianza.",
  },
  {
    titulo: "Las pachucas",
    icono: "💃",
    texto:
      "Las pachucas danzaban, peinaban su tupé alto y vestían a su manera, desafiando lo que se esperaba de ellas. Fueron juzgadas el doble —por mexicanas y por mujeres— y, aun así, hicieron del estilo un terreno propio.",
  },
  {
    titulo: "La música, siempre",
    icono: "🎼",
    texto:
      "Del swing y el jazz de los cuarenta al boogie-woogie y el rhythm & blues, la música fue el pegamento de la comunidad. Décadas después, esa herencia suena en el rock chicano, en bandas como Ozomatli y en los bailes commemorativos que aún se organizan.",
  },
  {
    titulo: "El legado vivo",
    icono: "🎨",
    texto:
      "La estética pachuca vive en murales, en el teatro y el cine (Zoot Suit, 1981), en la cultura lowrider, en exposiciones de museos y en los dances que todavía reúnen a familias con trajes heredados de abuelos y abuelas.",
  },
];

export const introduccionCostumbres =
  "Ser pachuco era una forma de vivir en comunidad: bailar, arreglarse, hablar en caló y cuidar el barrio. Estas costumbres convirtieron un estilo en una cultura completa, y esa cultura en una herencia que sigue viva.";
