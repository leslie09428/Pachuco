"use client";

import { useEffect, useRef, useState } from "react";
import { BotonesVoz } from "../../components/voz/BotonesVoz";
import { useVoz } from "../../lib/voz/useVoz";

interface MensajeChat {
  rol: "usuario" | "cronista";
  texto: string;
}

interface TemaRelacionado {
  id: string;
  etiqueta: string;
}

interface RespuestaCronista {
  temaId: string;
  respuesta: string;
  temasRelacionados: TemaRelacionado[];
}

export function CronistaChat() {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      rol: "cronista",
      texto:
        "¡Órale, qué gusto verte! Soy El Cronista, tu guía por el mundo pachuco. Pregúntame de la historia, del traje zoot, del caló o de los dances. ¿Por dónde empezamos?",
    },
  ]);
  const [temas, setTemas] = useState<TemaRelacionado[]>([
    { id: "quienes-eran", etiqueta: "¿Quiénes eran los pachucos?" },
    { id: "zoot-suit", etiqueta: "El traje zoot" },
    { id: "calo", etiqueta: "El caló" },
    { id: "dance-swing", etiqueta: "El dance y el swing" },
  ]);
  const [pregunta, setPregunta] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);
  const voz = useVoz();

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes, ocupado]);

  async function preguntar(texto: string) {
    const limpia = texto.trim();
    if (!limpia || ocupado) return;

    setMensajes((prev) => [...prev, { rol: "usuario", texto: limpia }]);
    setPregunta("");
    setTemas([]);
    setOcupado(true);
    setError(null);

    try {
      const res = await fetch("/api/cronista", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: limpia, historial: mensajes.slice(-10) }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as RespuestaCronista;
      setMensajes((prev) => [...prev, { rol: "cronista", texto: data.respuesta }]);
      setTemas(data.temasRelacionados);
      voz.hablar(data.respuesta);
    } catch {
      setError(
        "No pude conectar con Gemini. Configura GEMINI_API_KEY en .env y vuelve a intentarlo, carnal.",
      );
      setTemas([
        { id: "quienes-eran", etiqueta: "¿Quiénes eran los pachucos?" },
        { id: "zoot-suit", etiqueta: "El traje zoot" },
      ]);
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div
      className="flex h-[520px] flex-col overflow-hidden rounded-xl border-2 border-mural-gold bg-mural-night/95 shadow-[0_0_30px_rgba(74,28,28,0.4)]"
      aria-label="Conversación con El Cronista"
    >
      <div className="flex items-center gap-3 border-b border-mural-gold/40 bg-mural-teal/30 px-5 py-3">
        <span
          className="inline-block h-3 w-3 rounded-full bg-mural-gold"
          aria-hidden="true"
        />
        <div>
          <p className="font-display text-lg font-bold text-mural-gold">
            El Cronista
          </p>
          <p className="text-xs text-mural-blush/80">
            Inteligencia artificial dedicada a la cultura pachuco
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {mensajes.map((m, i) =>
          m.rol === "usuario" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-mural-teal px-4 py-2.5 text-sm leading-relaxed text-mural-cream">
                {m.texto}
              </p>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md bg-mural-cream px-4 py-2.5 text-sm leading-relaxed text-mural-night">
                {m.texto}
              </p>
            </div>
          ),
        )}

        {ocupado && (
          <div className="flex justify-start">
            <p className="rounded-2xl rounded-bl-md bg-mural-cream px-4 py-2.5 text-sm text-mural-night/70">
              El Cronista está recordando la crónica…
            </p>
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-mural-rose bg-mural-night px-4 py-2 text-sm text-mural-rose"
          >
            {error}
          </p>
        )}
        {voz.error && (
          <p
            role="alert"
            className="rounded-lg border border-mural-rose bg-mural-night px-4 py-2 text-sm text-mural-rose"
          >
            {voz.error}
          </p>
        )}
        <div ref={finRef} />
      </div>

      {temas.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {temas.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => preguntar(t.etiqueta)}
              className="rounded-full border border-mural-gold/60 px-3 py-1 text-xs text-mural-gold transition hover:bg-mural-gold hover:text-mural-night"
            >
              {t.etiqueta}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex border-t border-mural-gold/40"
        onSubmit={(e) => {
          e.preventDefault();
          preguntar(pregunta);
        }}
      >
        <input
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Escribe tu pregunta aquí…"
          maxLength={500}
          className="flex-1 bg-transparent px-5 py-3.5 text-sm text-mural-cream placeholder:text-mural-blush/50 focus:outline-none"
          aria-label="Pregunta para El Cronista"
        />
        <BotonesVoz
          escuchando={voz.escuchando}
          hablando={voz.hablando}
          vozActiva={voz.vozActiva}
          soportaMicrofono={voz.soportaMicrofono}
          onMicrofono={() => {
            if (voz.escuchando) {
              voz.detenerEscucha();
            } else {
              voz.escuchar(preguntar, setPregunta);
            }
          }}
          onAlternarVoz={voz.alternarVoz}
          deshabilitado={ocupado}
        />
        <button
          type="submit"
          disabled={ocupado || pregunta.trim().length === 0}
          className="bg-mural-gold px-6 text-sm font-bold text-mural-night transition hover:bg-mural-gold/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ¡Órale!
        </button>
      </form>
    </div>
  );
}
