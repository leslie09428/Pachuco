import { temasCronista, temaNoEncontrado, type TemaCronista } from "./temas";

/** Quita acentos y signos, y normaliza a minúsculas. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!.,;:()[\]"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface RespuestaCronista {
  temaId: string;
  respuesta: string;
  temasRelacionados: { id: string; etiqueta: string }[];
}

function encontrarTema(mensaje: string): TemaCronista | null {
  const normalizado = normalizar(mensaje);
  if (!normalizado) return null;

  let mejor: { tema: TemaCronista; puntaje: number } | null = null;
  for (const tema of temasCronista) {
    let puntaje = 0;
    for (const clave of tema.palabrasClave) {
      if (normalizado.includes(clave)) {
        // Frases largas que coinciden pesan más que palabras sueltas.
        puntaje += clave.includes(" ") ? 3 : 1;
      }
    }
    if (puntaje > 0 && (!mejor || puntaje > mejor.puntaje)) {
      mejor = { tema, puntaje };
    }
  }
  return mejor?.tema ?? null;
}

function temasPorId(ids: string[]): { id: string; etiqueta: string }[] {
  return ids
    .map((id) => temasCronista.find((t) => t.id === id))
    .filter((t): t is TemaCronista => Boolean(t))
    .map(({ id, etiqueta }) => ({ id, etiqueta }));
}

/**
 * Responde a partir de la base curada. En la fase 2, un modelo de IA en la
 * nube puede reemplazar `encontrarTema` recibiendo los mismos temas como
 * contexto (RAG) sin cambiar la interfaz.
 */
export function responder(mensaje: string): RespuestaCronista {
  const tema = encontrarTema(mensaje);

  if (!tema) {
    return {
      temaId: temaNoEncontrado.id,
      respuesta: temaNoEncontrado.respuesta,
      temasRelacionados: temasPorId(temaNoEncontrado.sugerencias),
    };
  }

  return {
    temaId: tema.id,
    respuesta: tema.respuesta,
    temasRelacionados: temasPorId(tema.relacionados),
  };
}
