/**
 * Base de conocimiento curada de "El Cronista", el asistente de Crónicas
 * del Pachuco. Cada tema contiene palabras clave en español (con y sin
 * acentos) y una respuesta conversacional verificada contra el contenido
 * cultural del sitio.
 *
 * Fase 2 (futura): si se conecta un modelo de IA en la nube, esta base
 * sirve como fuente de contexto (RAG) y los ids de tema como rutas de
 * respuesta. La interfaz de `responder()` es la única pieza a cambiar.
 */

export interface TemaCronista {
  id: string;
  etiqueta: string;
  palabrasClave: string[];
  respuesta: string;
  relacionados: string[];
}

export const temasCronista: TemaCronista[] = [
  {
    id: "quienes-eran",
    etiqueta: "¿Quiénes eran los pachucos?",
    palabrasClave: [
      "quienes eran los pachucos",
      "que eran los pachucos",
      "quien era el pachuco",
      "que es un pachuco",
      "definicion pachuco",
      "historia pachuco",
      "historia de los pachucos",
      "pachucos significado",
      "cuenta me de los pachucos",
      "los pachucos",
    ],
    respuesta:
      "¡Órale, buena pregunta! Los pachucos fueron jóvenes mexicoamericanos de los años treinta y cuarenta, sobre todo en Los Ángeles y El Paso. Se hicieron notar por tres cosas: el traje zoot, el caló y el swing. En una época de mucha discriminación, su manera de vestirse, hablar y bailar era una declaración de orgullo: «aquí estamos, y estamos con orgullo». ¿Quieres que te cuente del traje, del idioma o de su historia?",
    relacionados: ["zoot-suit", "calo", "zoot-suit-riots"],
  },
  {
    id: "origen-termino",
    etiqueta: "¿De dónde viene la palabra «pachuco»?",
    palabrasClave: [
      "de donde viene la palabra",
      "origen de la palabra pachuco",
      "por que se llaman pachucos",
      "que significa pachuco",
      "el chuco",
      "el paso pachuco",
      "etimologia pachuco",
    ],
    respuesta:
      "La palabra «pachuco» nace en la frontera. La versión más aceptada la liga a El Paso, Texas, a los jóvenes de esa ciudad que en los años treinta crearon un estilo propio; a El Paso todavía le dicen «El Chuco». De ahí el término viajó con la migración hasta Los Ángeles, donde el pachuquismo floreció en los cuarenta. Fíjate qué bonito: la identidad pachuca es cultura de frontera desde su nombre.",
    relacionados: ["quienes-eran", "calo"],
  },
  {
    id: "zoot-suit",
    etiqueta: "El traje zoot",
    palabrasClave: [
      "zoot suit",
      "traje zoot",
      "traco",
      "traje pachuco",
      "vestimenta",
      "vestimenta pachuca",
      "como se vestian",
      "ropa pachuca",
      "el saco",
      "el pantalon zoot",
      "cadena de reloj",
      "sombrero pachuco",
    ],
    respuesta:
      "¡El traco, la armadura de fiesta del pachuco! El zoot suit es un saco largo hasta la rodilla con hombros enormes, un pantalón de tiro alto con piernas muy amplias que se ajustan al tobillo, sombrero de ala ancha con pluma, una cadena de reloj larga y brillante, zapatos puntiagudos lustrados y corbata delgada. Cada pieza tenía intención: ocupar espacio y plantarse con elegancia en un mundo que los menospreciaba. En la sección «Vestimenta» del sitio puedes ver cada pieza con detalle.",
    relacionados: ["vestimenta-significado", "pachucas", "zoot-suit-riots"],
  },
  {
    id: "vestimenta-significado",
    etiqueta: "¿Por qué se vestían así?",
    palabrasClave: [
      "por que se vestian asi",
      "por que ese traje",
      "significado del traje",
      "elegancia pachuca",
      "que representaba el traje",
      "vestirse bien",
    ],
    respuesta:
      "Vestirse así era un acto de dignidad. En los cuarenta, a los jóvenes mexicoamericanos se les trataba como delincuentes por solo existir en ciertos lugares. El zoot suit respondía con dramatismo y pulcritud: traje planchado, zapatos lustrados, sombrero con etiqueta. La elegancia era su respuesta a un mundo que los quería invisibles: «yo valgo, y me visto como valgo». Por eso arrancarles el traje, como pasó en 1943, fue arrancarles algo más que ropa.",
    relacionados: ["zoot-suit", "zoot-suit-riots", "quienes-eran"],
  },
  {
    id: "zoot-suit-riots",
    etiqueta: "Los Zoot Suit Riots de 1943",
    palabrasClave: [
      "zoot suit riots",
      "zoot suit riot",
      "riot de 1943",
      "disturbios 1943",
      "disturbios zoot",
      "que paso en 1943",
      "marineros pachucos",
      "los riots",
      "riots de 1943",
      "ataques a pachucos",
    ],
    respuesta:
      "En junio de 1943, durante varios días, militares y civiles blancos recorrieron Los Ángeles atacando a jóvenes pachucos: les arrancaban el traje a golpes en plena calle, y la policía, en vez de protegerlos, arrestaba a las víctimas. Los Zoot Suit Riots le mostraron al país, en plena Segunda Guerra Mundial, el rostro de la discriminación contra la comunidad mexicana. Paradójicamente, después de esos días el zoot suit se volvió aún más un símbolo de identidad y resistencia.",
    relacionados: ["sleepy-lagoon", "zoot-suit", "quienes-eran"],
  },
  {
    id: "sleepy-lagoon",
    etiqueta: "El caso Sleepy Lagoon",
    palabrasClave: [
      "sleepy lagoon",
      "caso sleepy lagoon",
      "juicio injusto",
      "1942",
      "que paso en 1942",
      "la laguna",
      "condenados",
    ],
    respuesta:
      "En agosto de 1942, tras la muerte de un joven cerca de Los Ángeles, la prensa y la policía culparon sin pruebas a los jóvenes mexicoamericanos del barrio. Hubo detenciones masivas y un juicio lleno de injusticias: se condenó a varios inocentes. La comunidad se organizó en el Sleepy Lagoon Defense Committee, y en octubre de 1944 una corte de apelación revocó las condenas. Fue una de las primeras grandes victorias de organización civil mexicoamericana.",
    relacionados: ["zoot-suit-riots", "legado"],
  },
  {
    id: "calo",
    etiqueta: "El caló",
    palabrasClave: [
      "calo",
      "lenguaje pachuco",
      "idioma pachuco",
      "habla pachuca",
      "que es el calo",
      "como hablaban",
      "argot",
      "lengua del barrio",
    ],
    respuesta:
      "El caló es la lengua del barrio pachuco: una mezcla viva de español, inglés, argot y rasgos del caló gitano español que llegó con la migración. No era español ni inglés: era pachuco. Hablarlo era reconocerse entre iguales. ¿Quieres que te enseñe algunas palabras? También tienes el glosario completo en la sección «El Caló» del sitio.",
    relacionados: ["calo-palabras", "quienes-eran"],
  },
  {
    id: "calo-palabras",
    etiqueta: "Palabras de caló",
    palabrasClave: [
      "palabras de calo",
      "ensename palabras",
      "palabras pachucas",
      "que significa orale",
      "que significa simon",
      "que significa carnal",
      "ejemplos de calo",
      "vocabulario",
      "significados",
    ],
    respuesta:
      "¡Va, te suelto algunas! «Órale» es ánimo, sorpresa o saludo según el tono. «Simón» es sí, y «nel» es no. «Carnal» es el hermano o el amigo del corazón; «la jefa» y «el jefe» son mamá y papá; «el chante» es la casa; «la feria» es el dinero; «chido» es algo bueno; y «la jaina» era la novia con estilo. Practica con una: «Órale, carnal, tu traco está bien chido». ¿De cuál quieres más detalle?",
    relacionados: ["calo", "zoot-suit"],
  },
  {
    id: "pachucas",
    etiqueta: "Las pachucas",
    palabrasClave: [
      "pachucas",
      "mujeres pachucas",
      "ellas",
      "las mujeres pachucas",
      "jaina",
      "chicas pachucas",
    ],
    respuesta:
      "Las pachucas merecen su propia crónica. Llevaban versiones del traje: falda larga o incluso pantalón, hombros marcados, peinado alto y labios llamativos. Bailaban jitterbug en público y hablaban caló. En una época que exigía silencio y obediencia a las mujeres, la pachuca fue juzgada el doble —por mexicana y por mujer— y aun así hizo del estilo un terreno propio. Su desafío fue también feminista, aunque nadie lo llamara así entonces.",
    relacionados: ["zoot-suit", "dance-swing", "quienes-eran"],
  },
  {
    id: "dance-swing",
    etiqueta: "El dance y el swing",
    palabrasClave: [
      "musica",
      "swing",
      "jitterbug",
      "baile",
      "dance",
      "big band",
      "jazz",
      "como bailaban",
      "salones de baile",
      "que musica escuchaban",
    ],
    respuesta:
      "La vida pachuca sonaba a swing. En salones y auditorios sonaban las big bands de la época, y el jitterbug pachuco era puro espectáculo: vueltas, saltos y hasta acrobacias. El dance era el centro de la vida social: ahí se veía el traco nuevo, se competía en estilo y se hacía comunidad. La herencia musical no se detuvo: pasó al boogie-woogie, al rock chicano y a bandas actuales como Ozomatli.",
    relacionados: ["costumbres", "pachucas", "legado"],
  },
  {
    id: "costumbres",
    etiqueta: "Costumbres pachucas",
    palabrasClave: [
      "costumbres",
      "vida cotidiana",
      "que hacian",
      "como vivian",
      "barrio",
      "tradicion",
      "cultura pachuca",
      "vida social",
    ],
    respuesta:
      "Ser pachuco era una forma de vivir en comunidad. El barrio era el salón de la casa grande: las esquinas eran lugar de conversación y broma; el baile, la fiesta semanal; el arreglo personal, una ética diaria. Vestirse bien, hablar bien (en caló) y cuidar a los tuyos eran las reglas. La elegancia no era vanidad: era respeto propio y respeto al barrio. En la sección «Costumbres» del sitio tienes las crónicas completas.",
    relacionados: ["dance-swing", "calo", "zoot-suit"],
  },
  {
    id: "legado",
    etiqueta: "El legado del pachuco",
    palabrasClave: [
      "legado",
      "hoy en dia",
      "actualidad",
      "chicano",
      "movimiento chicano",
      "por que importa",
      "importancia",
      "influencia",
      "lowrider",
      "que queda de los pachucos",
    ],
    respuesta:
      "El pachuco es el abuelo orgulloso del movimiento chicano. En los sesenta y setenta, la lucha por los derechos civiles reivindicó a los pachucos como precursores de la afirmación cultural. Luis Valdez los llevó al teatro con «Zoot Suit» (1978, Broadway 1979, cine 1981) con Edward James Olmos como El Pachuco. Hoy su estética vive en murales, museos, la cultura lowrider y los dances que aún reúnen familias con trajes heredados.",
    relacionados: ["zoot-suit-riots", "sleepy-lagoon", "dance-swing"],
  },
  {
    id: "zoot-suit-obra",
    etiqueta: "La obra Zoot Suit",
    palabrasClave: [
      "zoot suit obra",
      "luis valdez",
      "edward james olmos",
      "pelicula zoot suit",
      "teatro",
      "obra de teatro",
      "el pachuco personaje",
      "1981",
    ],
    respuesta:
      "En 1978, Luis Valdez estrenó «Zoot Suit» en Los Ángeles: la historia de un joven juzgado injustamente tras el caso Sleepy Lagoon, narrada junto a El Pachuco, un personaje majestuoso que rompe la cuarta pared y representa el espíritu del barrio. Edward James Olmos lo hizo legendario en el teatro y en la película de 1981. Fue la primera obra de un autor chicano en Broadway y devolvió al pachuco al centro de la cultura popular.",
    relacionados: ["legado", "sleepy-lagoon", "zoot-suit-riots"],
  },
  {
    id: "saludo",
    etiqueta: "Saludar",
    palabrasClave: [
      "hola",
      "buenas",
      "que onda",
      "que tal",
      "buenos dias",
      "buenas tardes",
      "buenas noches",
      "saludos",
      "que transa",
      "hey",
      "que hubo",
    ],
    respuesta:
      "¡Órale, qué gusto verte! Soy El Cronista, tu guía por el mundo pachuco. Pregúntame lo que quieras: historia, el traje zoot, el caló, los dances, las pachucas o lo que quedó de todo eso hoy. ¿Por dónde empezamos?",
    relacionados: ["quienes-eran", "zoot-suit", "calo"],
  },
  {
    id: "quien-eres",
    etiqueta: "¿Quién es El Cronista?",
    palabrasClave: [
      "quien eres",
      "que eres",
      "tu nombre",
      "cronista",
      "como te llamas",
      "eres un robot",
      "eres humano",
      "eres una ia",
    ],
    respuesta:
      "Soy El Cronista, el cronista digital de Crónicas del Pachuco. Cuanto sé proviene del contenido cultural de este sitio, curado con cuidado: historia, vestimenta, lenguaje y costumbres del mundo pachuco. No soy adivino: si algo no lo tengo, te lo digo con honestidad y te acerco los temas que sí domino. Simón, soy un asistente, pero uno con mucho barrio.",
    relacionados: ["saludo", "quienes-eran", "calo"],
  },
  {
    id: "gracias",
    etiqueta: "Agradecer y despedirse",
    palabrasClave: [
      "gracias",
      "muchas gracias",
      "adios",
      "nos vemos",
      "bye",
      "chao",
      "hasta luego",
      "me voy",
    ],
    respuesta:
      "¡A ti! Ha sido un gusto cronistear contigo. Vuelve cuando quieras: aquí estaré, cuidando el traco y la memoria del barrio. ¡Órale, nos vemos en el dance!",
    relacionados: ["saludo", "legado"],
  },
];

export const temaNoEncontrado = {
  id: "",
  respuesta:
    "Esa se me escapa, carnal: mi memoria es la de este sitio, y ahí no tengo esa crónica todavía. Pero puedo contarte de la historia de los pachucos, del traje zoot, del caló, de las pachucas, del swing o del legado chicano. ¿Cuál te late más?",
  sugerencias: ["quienes-eran", "zoot-suit", "calo", "dance-swing", "legado"],
};
