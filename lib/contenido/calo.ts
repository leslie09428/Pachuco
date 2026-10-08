/**
 * Glosario del caló, la lengua del barrio pachuco.
 */

export type CategoriaCalo =
  | "Saludos y ánimo"
  | "Gente"
  | "Lugares"
  | "Cosas"
  | "Expresiones";

export interface EntradaCalo {
  palabra: string;
  significado: string;
  ejemplo: string;
  categoria: CategoriaCalo;
}

export const categoriasCalo: CategoriaCalo[] = [
  "Saludos y ánimo",
  "Gente",
  "Lugares",
  "Cosas",
  "Expresiones",
];

export const glosarioCalo: EntradaCalo[] = [
  {
    palabra: "Órale",
    significado:
      "La expresión pachuca por excelencia: ánimo, sorpresa, aprobación o saludo, según el tono.",
    ejemplo: "«¡Órale, simón! Ahí nos vemos en el dance.»",
    categoria: "Saludos y ánimo",
  },
  {
    palabra: "Simón",
    significado: "Sí, claro, cómo no.",
    ejemplo: "«¿Vas al baile? — Simón, ¿qué creías?»",
    categoria: "Saludos y ánimo",
  },
  {
    palabra: "Nel",
    significado: "No, qué va, ni hablar.",
    ejemplo: "«¿Me prestas tu cadena? — Nel, carnal, es de la familia.»",
    categoria: "Saludos y ánimo",
  },
  {
    palabra: "Chale",
    significado: "Expresión de desagrado o decepción.",
    ejemplo: "«¿Que cancelaron el baile? ¡Chale!»",
    categoria: "Saludos y ánimo",
  },
  {
    palabra: "Chido",
    significado: "Bueno, padre, excelente.",
    ejemplo: "«Tu traje nuevo está bien chido.»",
    categoria: "Saludos y ánimo",
  },
  {
    palabra: "Carnal / carnala",
    significado:
      "Hermano o hermana de sangre, y por extensión el amigo del corazón.",
    ejemplo: "«Órale, carnal, ¿cómo estás?»",
    categoria: "Gente",
  },
  {
    palabra: "Chavalo / chava",
    significado: "Muchacho, joven (chava para la muchacha).",
    ejemplo: "«Los chavalos del barrio iban todos al dance.»",
    categoria: "Gente",
  },
  {
    palabra: "Bato / vato",
    significado: "Tipo, sujeto, muchacho.",
    ejemplo: "«Ese bato sí sabe vestirse.»",
    categoria: "Gente",
  },
  {
    palabra: "Ruca / ruco",
    significado: "La novia o la esposa; el novio o el esposo.",
    ejemplo: "«Le presentó a su ruca en el baile.»",
    categoria: "Gente",
  },
  {
    palabra: "Jaina",
    significado:
      "La joven, la novia, sobre todo si también llevaba el estilo pachuco.",
    ejemplo: "«La jaina bailaba swing como nadie.»",
    categoria: "Gente",
  },
  {
    palabra: "La jefa / el jefe",
    significado: "La mamá y el papá, con cariño y respeto.",
    ejemplo: "«Me va a regañar la jefa si llego tarde.»",
    categoria: "Gente",
  },
  {
    palabra: "El barrio",
    significado:
      "El vecindario, la comunidad: el corazón de la vida pachuca.",
    ejemplo: "«Del barrio pa'l real, como dicen.»",
    categoria: "Lugares",
  },
  {
    palabra: "El chante / el cantón",
    significado: "La casa, el hogar.",
    ejemplo: "«Nos juntamos en mi chante a oír discos.»",
    categoria: "Lugares",
  },
  {
    palabra: "El dance",
    significado:
      "El baile, la fiesta de salón donde sonaba el swing y donde se veía el estilo.",
    ejemplo: "«El dance de este sábado va a estar de lujo.»",
    categoria: "Lugares",
  },
  {
    palabra: "La feria",
    significado: "El dinero.",
    ejemplo: "«Ahorró toda su feria para comprarse el traje.»",
    categoria: "Cosas",
  },
  {
    palabra: "El traco",
    significado:
      "El traje, la ropa; en especial el zoot suit, la vestimenta ceremonial del pachuco.",
    ejemplo: "«Se limpió el traco antes del dance.»",
    categoria: "Cosas",
  },
  {
    palabra: "El faso",
    significado: "El cigarro.",
    ejemplo: "«Se fumó un faso en la puerta del salón.»",
    categoria: "Cosas",
  },
  {
    palabra: "La ranfla",
    significado:
      "El carro, sobre todo el carro arreglado con orgullo, antecedente de la cultura lowrider.",
    ejemplo: "«Llegó en su ranfla recién pintada.»",
    categoria: "Cosas",
  },
  {
    palabra: "La chota / la jura",
    significado: "La policía, en tono de desconfianza.",
    ejemplo: "«Ojo con la chota, anda dando vueltas por el barrio.»",
    categoria: "Cosas",
  },
  {
    palabra: "El tecolote",
    significado:
      "El pájaro de mal agüero: «cuando el tecolote canta, el indio está de muerto». Se usaba para alejar la mala suerte.",
    ejemplo: "«No menciones eso, ¿quieres que cante el tecolote?»",
    categoria: "Expresiones",
  },
  {
    palabra: "Al chile",
    significado: "La verdad, en serio, sin rodeos.",
    ejemplo: "«Al chile, ese baile estuvo bueno.»",
    categoria: "Expresiones",
  },
  {
    palabra: "Al neto",
    significado: "Exacto, tal cual es la realidad.",
    ejemplo: "«Al neto, no le temían a nada.»",
    categoria: "Expresiones",
  },
  {
    palabra: "A huevo",
    significado: "Por supuesto, con toda seguridad.",
    ejemplo: "«¿Ganaron? ¡A huevo que ganaron!»",
    categoria: "Expresiones",
  },
  {
    palabra: "Gacho",
    significado: "Feo, malo, de mal gusto.",
    ejemplo: "«Qué gacho lo que hicieron con el caso Sleepy Lagoon.»",
    categoria: "Expresiones",
  },
  {
    palabra: "Tirado",
    significado: "Triste, decaído, desanimado.",
    ejemplo: "«Salió tirado del juicio de su compadre.»",
    categoria: "Expresiones",
  },
  {
    palabra: "Pachucada",
    significado:
      "La bola de pachucos, o aquello que es característicamente pachuco.",
    ejemplo: "«Toda la pachucada andaba en el salón.»",
    categoria: "Expresiones",
  },
];

export const introduccionCalo =
  "El caló es la lengua del barrio: una mezcla viva de español, inglés, argot y rasgos del caló gitano español que llegó con la migración. No era español ni inglés: era pachuco. Hablarlo era reconocerse entre iguales y dibujar una frontera propia dentro de dos países.";
