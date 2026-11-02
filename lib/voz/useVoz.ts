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

// Divide el texto en hasta 3 partes: primera frase, segunda frase y el resto.
// El audio tarda más mientras más texto tenga, así que las partes cortas
// empiezan a sonar antes y las demás se generan mientras tanto.
function dividirTexto(texto: string): string[] {
  const frases =
    texto.match(/[^.!?\n]+[.!?]*/g)?.map((f) => f.trim()).filter(Boolean) ??
    [texto];
  if (frases.length <= 1) return [texto];
  if (frases.length === 2) return frases;
  const [primera, segunda, ...resto] = frases;
  return [primera, segunda, resto.join(" ")];
}

// ---- Ajustes ----
const IDIOMA = "es-MX";
// Solo afectan a la voz de respaldo del navegador (la principal es la del servidor)
const VELOCIDAD_RESPALDO = 0.95;
const TONO_RESPALDO = 0.85;

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
  const [cargandoVoz, setCargandoVoz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reconocimientoRef = useRef<Reconocimiento | null>(null);
  const vozElegidaRef = useRef<SpeechSynthesisVoice | null>(null);
  const vozActivaRef = useRef(true);

  // Audio del servidor
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlAudioRef = useRef<string | null>(null);
  const peticionRef = useRef<AbortController | null>(null);

  /** Detiene cualquier audio, petición o voz del navegador en curso. */
  const detenerTodo = useCallback(() => {
    peticionRef.current?.abort();
    peticionRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (urlAudioRef.current) {
      URL.revokeObjectURL(urlAudioRef.current);
      urlAudioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    setSoportaMicrofono(obtenerReconocimiento() !== null);

    if (!("speechSynthesis" in window)) {
      return () => {
        detenerTodo();
        reconocimientoRef.current?.abort();
      };
    }

    // Voz de respaldo: la mejor voz en español de México que tenga el navegador
    const elegirVoz = () => {
      const voces = window.speechSynthesis.getVoices();
      const idioma = (v: SpeechSynthesisVoice) => v.lang.replace("_", "-");
      const espanol = voces.filter((v) => idioma(v).startsWith("es"));
      const mexico = espanol.filter((v) => idioma(v) === "es-MX");

      vozElegidaRef.current =
        mexico.find((v) => /jorge/i.test(v.name)) ??
        mexico.find((v) => /natural|online/i.test(v.name)) ??
        mexico[0] ??
        espanol.find((v) => idioma(v) === "es-US") ??
        espanol[0] ??
        null;
    };
    elegirVoz();
    window.speechSynthesis.addEventListener("voiceschanged", elegirVoz);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", elegirVoz);
      detenerTodo();
      reconocimientoRef.current?.abort();
    };
  }, [detenerTodo]);

  /** Respaldo: voz del propio navegador (suena más robótica). */
  const hablarConNavegador = useCallback((texto: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    // Se habla por frases: así Chrome no corta los textos largos.
    const frases =
      texto.match(/[^.!?\n]+[.!?]*/g)?.map((f) => f.trim()).filter(Boolean) ??
      [texto];

    frases.forEach((frase, i) => {
      const locucion = new SpeechSynthesisUtterance(frase);
      locucion.lang = IDIOMA;
      locucion.rate = VELOCIDAD_RESPALDO;
      locucion.pitch = TONO_RESPALDO;
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

  /**
   * El Cronista dice el texto en voz alta.
   * Primero pide el audio natural a ElevenLabs vía /api/voz; si falla (límite, internet…),
   * usa la voz del navegador para que nunca se quede callado.
   */
  const hablar = useCallback(
    async (texto: string) => {
      if (!vozActivaRef.current) return;
      const limpio = texto.trim();
      if (!limpio) return;

      detenerTodo();
      setError(null);
      const control = new AbortController();
      peticionRef.current = control;
      setCargandoVoz(true);

      const fragmentos = dividirTexto(limpio);

      // Pide el audio de un fragmento al servidor
      const pedirAudio = async (fragmento: string): Promise<Blob> => {
        const respuesta = await fetch("/api/voz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texto: fragmento }),
          signal: control.signal,
        });
        if (!respuesta.ok) {
          const data = (await respuesta.json()) as { error?: unknown };
          const mensaje =
            typeof data.error === "string"
              ? data.error
              : `ElevenLabs respondió con HTTP ${respuesta.status}.`;
          throw new Error(mensaje);
        }
        return respuesta.blob();
      };

      // Reproduce un audio y avisa cuando termina
      const reproducir = (blob: Blob) =>
        new Promise<void>((resolver, rechazar) => {
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          urlAudioRef.current = url;
          audioRef.current = audio;

          const limpiar = () => {
            URL.revokeObjectURL(url);
            if (urlAudioRef.current === url) urlAudioRef.current = null;
            if (audioRef.current === audio) audioRef.current = null;
          };

          audio.onplay = () => setHablando(true);
          audio.onended = () => {
            limpiar();
            resolver();
          };
          audio.onpause = () => {
            limpiar();
            resolver();
          };
          audio.onerror = () => {
            limpiar();
            rechazar(new Error("No se pudo reproducir el audio"));
          };

          audio.play().catch((e) => {
            limpiar();
            rechazar(e);
          });
        });

      let indice = 0;
      try {
        for (indice = 0; indice < fragmentos.length; indice++) {
          const blob = await pedirAudio(fragmentos[indice]);
          if (control.signal.aborted) return;
          setCargandoVoz(false);
          await reproducir(blob);
          if (control.signal.aborted) return;
        }
        setHablando(false);
      } catch (error) {
        // Si se canceló a propósito, no hay nada más que hacer
        if (control.signal.aborted) return;
        setCargandoVoz(false);
        setError(
          `${error instanceof Error ? error.message : "Falló la voz de ElevenLabs."} Se usará la voz del navegador.`,
        );
        // Respaldo: lo que falte lo dice la voz del navegador
        hablarConNavegador(fragmentos.slice(indice).join(" "));
      }
    },
    [detenerTodo, hablarConNavegador],
  );

  /** Calla al Cronista de inmediato. */
  const detenerVoz = useCallback(() => {
    detenerTodo();
    setHablando(false);
    setCargandoVoz(false);
  }, [detenerTodo]);

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
    cargandoVoz,
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