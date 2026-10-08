/**
 * Anatomía del traje zoot: cada pieza y su significado.
 */

export interface PiezaVestimenta {
  pieza: string;
  descripcion: string;
  significado: string;
}

export const piezasZootSuit: PiezaVestimenta[] = [
  {
    pieza: "El saco",
    descripcion:
      "Largo, casi hasta la rodilla, con hombros muy anchos —realzados con hombreras— y solapas grandes. Cae holgado sobre el cuerpo como una capa.",
    significado:
      "La silueta dramática era la firma del pachuco: ocupar espacio, ser imposible de ignorar.",
  },
  {
    pieza: "El pantalón",
    descripcion:
      "De tiro muy alto y ceñido en la cintura, con las piernas enormemente amplias que se ajustan con pliegues en el tobillo.",
    significado:
      "El contraste holgado-arriba y ceñido-abajo creaba una figura única, casi escultórica.",
  },
  {
    pieza: "El sombrero",
    descripcion:
      "De ala ancha, inclinado con estilo, adornado muchas veces con una pluma larga o una flor.",
    significado:
      "El sombrero coronaba la figura; quitárselo al saludar era parte de la etiqueta pachuca.",
  },
  {
    pieza: "La cadena de reloj",
    descripcion:
      "Una cadena larga y llamativa que colgaba del cinturón hasta el bolsillo del pantalón, muchas veces con reloj.",
    significado:
      "Brillo, ritmo y orgullo: al caminar o bailar, la cadena marcaba el paso como un instrumento.",
  },
  {
    pieza: "Los zapatos",
    descripcion:
      "Puntiagudos y lustrosos, a menudo de dos tonos, cuidados hasta el último brillo.",
    significado:
      "Los pies hacían el baile: el jitterbug pachuco exigía zapatos que brillaran tanto como el traje.",
  },
  {
    pieza: "La corbata y el pañuelo",
    descripcion:
      "Corbata delgada y pañuelo de color en el bolsillo del saco o al cuello.",
    significado:
      "Los acentos de color completaban la elegancia: nada al azar, todo pensado.",
  },
  {
    pieza: "El peinado",
    descripcion:
      "Cabello peinado hacia atrás en tupé (pompadour), muy fijado; hacia fines de los cuarenta, la «cola de pato» al estilo de la época.",
    significado:
      "Arreglarse el pelo podía tomar mucho tiempo: la imagen era parte del respeto propio.",
  },
];

export const pachucasVestimenta: PiezaVestimenta = {
  pieza: "El estilo de las pachucas",
  descripcion:
    "Las jóvenes pachucas versionaban el traje: falda larga o incluso pantalón, hombros marcados, peinado alto y labios llamativos, o una versión femenina del zoot suit.",
  significado:
    "En una época que exigía silencio y domesticidad a las mujeres, la pachuca se vistió a su manera y bailó en público: su estilo también fue un desafío.",
};

export const introduccionVestimenta =
  "El zoot suit —el «traco», en caló— no era solo ropa: era una armadura de fiesta. En tiempos en que la sociedad llamaba «delincuentes» a los jóvenes mexicoamericanos por solo existir, vestirse con ese dramatismo era plantarse con elegancia y decir «yo valgo». Cada pieza tenía intención, y en conjunto formaban una identidad.";
