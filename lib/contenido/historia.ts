/**
 * Cronología de la historia pachuca, usada por la sección "Historia"
 * y como fuente de contenido para "El Cronista".
 */

export interface HitosHistoricos {
  periodo: string;
  titulo: string;
  texto: string;
  destacado?: boolean;
}

export const lineaDelTiempo: HitosHistoricos[] = [
  {
    periodo: "Década de 1930",
    titulo: "Raíces en la frontera",
    texto:
      "Tras la migración mexicana al suroeste de Estados Unidos, los jóvenes de segunda generación buscan su propia identidad: ni se sienten del todo mexicanos ni aceptados como estadounidenses. El término «pachuco» nace en la frontera, con El Paso —«El Chuco»— como uno de sus lugares de origen, y de ahí se extiende a Los Ángeles y otras ciudades.",
  },
  {
    periodo: "Década de 1930",
    titulo: "Nace el estilo",
    texto:
      "El pachuco crea un mundo propio: el traje zoot con sus hombros anchos y pantalón holgado, el caló que mezcla español, inglés y argot, y el swing como banda sonora. Vestirse así era una declaración: existir con orgullo en un país que los veía como extranjeros.",
  },
  {
    periodo: "Agosto de 1942",
    titulo: "El caso Sleepy Lagoon",
    texto:
      "Tras la muerte de un joven cerca de Los Ángeles, la prensa culpró sin pruebas a los jóvenes mexicoamericanos. La policía detuvo a cientos y un juicio marcado por la injusticia condenó a varios inocentes. El caso se volvió un símbolo de la discriminación que vivía la comunidad.",
    destacado: true,
  },
  {
    periodo: "Junio de 1943",
    titulo: "Los Zoot Suit Riots",
    texto:
      "Durante varios días, militares y civiles blancos recorrieron Los Ángeles atacando a jóvenes pachucos: les arrancaban el traje a golpes en plena calle mientras la policía arrestaba a las víctimas. Los disturbios dejaron claro que el zoot suit se había vuelto un símbolo: arrancarlo era castigar una identidad, y llevarlo, un acto de dignidad.",
    destacado: true,
  },
  {
    periodo: "Octubre de 1944",
    titulo: "Justicia tardía",
    texto:
      "Gracias a la defensa organizada por la comunidad —el Sleepy Lagoon Defense Committee—, una corte de apelación revocó las condenas del caso Sleepy Lagoon. Fue una de las primeras grandes victorias de organización civil mexicoamericana en California.",
  },
  {
    periodo: "Décadas de 1950-1960",
    titulo: "De la leyenda al movimiento",
    texto:
      "El estilo evoluciona hacia la cultura del barrio: los carros arreglados, los salones de baile y la música. Con el auge del movimiento chicano, una nueva generación reivindica al pachuco como el abuelo orgulloso de su lucha por los derechos civiles.",
  },
  {
    periodo: "1978-1981",
    titulo: "Zoot Suit, del teatro al cine",
    texto:
      "Luis Valdez estrena la obra «Zoot Suit», con el personaje de El Pachuco —interpretado en teatro y cine por Edward James Olmos— rompiendo la cuarta pared para contar la historia de los jóvenes de 1943. Fue la primera obra de un autor chicano en Broadway y la llevó al cine en 1981, devolviendo al pachuco a la cultura popular.",
    destacado: true,
  },
  {
    periodo: "Hoy",
    titulo: "El pachuco vive",
    texto:
      "Murales, museos, exposiciones, bailes y coleccionistas de trajes mantienen viva la tradición en Los Ángeles, El Paso, Ciudad Juárez y el Paso del Norte. El pachuco es hoy un símbolo de orgullo mexicoamericano y de la cultura compartida en la frontera.",
  },
];

export const introduccionHistoria =
  "Los pachucos fueron jóvenes mexicoamericanos de los años treinta y cuarenta que se hicieron visibles con un estilo inconfundible: el traje zoot, el caló y el swing. En una época de discriminación abierta, elegir cómo vestirse, hablar y bailar fue su manera de decir: aquí estamos, y estamos con orgullo.";
