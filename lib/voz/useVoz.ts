"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ---- Tipos mínimos del reconocimiento de voz (TypeScript no los trae) ----
interface ResultadoVoz {
  isFinal: boolean;
  [indice: number]: { transcript: string };
}
interface EventoResultado {
  results: ArrayLike<ResultadoVoz>;
}
interface EventoErrorVoz {
  error: string;
}
interface Reconocimiento {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onresult: ((evento: EventoResultado) => void) | null;
  onerror: ((evento: EventoErrorVoz) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}
type ConstructorReconocimiento = new () => Reconocimiento;

function obtenerReconocimiento(): ConstructorReconocimiento | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: ConstructorReconocimiento;
    webkitSpeechRecognition?: ConstructorReconocimiento;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// ---- Ajustes de la voz del pachuco (puedes jugar con estos valores) ----
const IDIOMA = "es-MX";
const VELOCIDAD = 0.95; // 1 = normal; menor = más lento
const TONO = 0.85; // 1 = normal; menor = más grave

const MENSAJES_ERROR: Record<string, string> = {
  "not-allowed":
    "Permite el micrófono en el candado de la barra de direcciones y vuelve a intentar.",
  "service-not-allowed":
    "El navegador no dejó usar el micrófono. Revisa los permisos.",
  "no-speech": "No te escuché, carnal. Intenta de nuevo.",
  "audio-capture": "No encontré ningún micrófono conectado.",
  network: "Falló la conexión del reconocimiento de voz. Revisa tu internet.",
};

export function useVoz() {
  const [hablando, setHablando] = useState(false);
  const [escuchando, setEscuchando] = useState(false);
  const [vozActiva, setVozActiva] = useState(true);
  const [soportaMicrofono, setSoportaMicrofono] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reconocimientoRef = useRef<Reconocimiento | null>(null);
  const vozElegidaRef = useRef<SpeechSynthesisVoice | null>(null);
  const vozActivaRef = useRef(true);

  useEffect(() => {
    setSoportaMicrofono(obtenerReconocimiento() !== null);

    if (!("speechSynthesis" in window)) return undefined;

    // Busca una voz en español (primero México, luego EE. UU., luego cualquiera)
    const elegirVoz = () => {
      const voces = window.speechSynthesis.getVoices();
      vozElegidaRef.current =
        voces.find((v) => v.lang === "es-MX") ??
        voces.find((v) => v.lang.startsWith("es-US")) ??
        voces.find((v) => v.lang.startsWith("es")) ??
        null;
    };
    elegirVoz();
    window.speechSynthesis.addEventListener("voiceschanged", elegirVoz);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", elegirVoz);
      window.speechSynthesis.cancel();
      reconocimientoRef.current?.abort();
    };
  }, []);

  /** El Cronista dice el texto en voz alta. */
  const hablar = useCallback((texto: string) => {
    if (!vozActivaRef.current) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const limpio = texto.trim();
    if (!limpio) return;

    window.speechSynthesis.cancel();

    // Se habla por frases: así Chrome no corta los textos largos.
    const frases =
      limpio.match(/[^.!?\n]+[.!?]*/g)?.map((f) => f.trim()).filter(Boolean) ??
      [limpio];

    frases.forEach((frase, i) => {
      const locucion = new SpeechSynthesisUtterance(frase);
      locucion.lang = IDIOMA;
      locucion.rate = VELOCIDAD;
      locucion.pitch = TONO;
      if (vozElegidaRef.current) locucion.voice = vozElegidaRef.current;

      if (i === 0) locucion.onstart = () => setHablando(true);
      if (i === frases.length - 1) locucion.onend = () => setHablando(false);
      locucion.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") {
          setHablando(false);
        }
      };

      window.speechSynthesis.speak(locucion);
    });
  }, []);

  /** Calla al Cronista de inmediato. */
  const detenerVoz = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setHablando(false);
  }, []);

  /** Enciende o apaga la voz del Cronista. */
  const alternarVoz = useCallback(() => {
    const nuevoValor = !vozActivaRef.current;
    vozActivaRef.current = nuevoValor;
    setVozActiva(nuevoValor);
    if (!nuevoValor) detenerVoz();
  }, [detenerVoz]);

  /**
   * Activa el micrófono.
   * - onFinal: recibe el texto completo cuando terminas de hablar.
   * - onParcial (opcional): recibe el texto mientras hablas, para mostrarlo en el cuadro.
   */
  const escuchar = useCallback(
    (onFinal: (texto: string) => void, onParcial?: (texto: string) => void) => {
      const Constructor = obtenerReconocimiento();
      if (!Constructor) {
        setError(
          "Tu navegador no soporta el micrófono. Usa Chrome o Edge en computadora o Android.",
        );
        return;
      }

      setError(null);
      // Que el Cronista no se escuche a sí mismo mientras tú hablas
      detenerVoz();
      reconocimientoRef.current?.abort();

      const reconocimiento = new Constructor();
      reconocimiento.lang = IDIOMA;
      reconocimiento.interimResults = true;
      reconocimiento.continuous = false;
      reconocimiento.maxAlternatives = 1;

      let textoFinal = "";

      reconocimiento.onresult = (evento) => {
        let finales = "";
        let parcial = "";
        for (let i = 0; i < evento.results.length; i++) {
          const resultado = evento.results[i];
          if (resultado.isFinal) finales += resultado[0].transcript;
          else parcial += resultado[0].transcript;
        }
        textoFinal = finales;
        onParcial?.((finales + parcial).trim());
      };

      reconocimiento.onerror = (evento) => {
        setError(
          MENSAJES_ERROR[evento.error] ??
            "No se pudo usar el micrófono. Intenta de nuevo.",
        );
      };

      reconocimiento.onend = () => {
        setEscuchando(false);
        const texto = textoFinal.trim();
        if (texto) onFinal(texto);
      };

      reconocimientoRef.current = reconocimiento;
      try {
        reconocimiento.start();
        setEscuchando(true);
      } catch {
        setEscuchando(false);
      }
    },
    [detenerVoz],
  );

  /** Termina de escuchar (envía lo que alcanzó a oír). */
  const detenerEscucha = useCallback(() => {
    reconocimientoRef.current?.stop();
  }, []);

  return {
    hablando,
    escuchando,
    vozActiva,
    soportaMicrofono,
    error,
    hablar,
    detenerVoz,
    alternarVoz,
    escuchar,
    detenerEscucha,
  };
}