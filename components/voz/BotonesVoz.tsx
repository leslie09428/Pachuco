"use client";

interface BotonesVozProps {
  escuchando: boolean;
  hablando: boolean;
  vozActiva: boolean;
  soportaMicrofono: boolean;
  onMicrofono: () => void;
  onAlternarVoz: () => void;
  deshabilitado?: boolean;
}

const propsIcono = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconoMicrofono() {
  return (
    <svg {...propsIcono}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function IconoBocina({ activa }: { activa: boolean }) {
  return (
    <svg {...propsIcono}>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      {activa ? (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      ) : (
        <>
          <line x1="22" x2="16" y1="9" y2="15" />
          <line x1="16" x2="22" y1="9" y2="15" />
        </>
      )}
    </svg>
  );
}

const base =
  "flex items-center justify-center px-3 text-[#f5b83d] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f5b83d] disabled:cursor-not-allowed disabled:opacity-40";

export function BotonesVoz({
  escuchando,
  hablando,
  vozActiva,
  soportaMicrofono,
  onMicrofono,
  onAlternarVoz,
  deshabilitado = false,
}: BotonesVozProps) {
  return (
    <>
      {soportaMicrofono && (
        <button
          type="button"
          onClick={onMicrofono}
          disabled={deshabilitado}
          aria-label={escuchando ? "Dejar de escuchar" : "Hablarle al Cronista"}
          aria-pressed={escuchando}
          title={escuchando ? "Escuchando… toca para enviar" : "Hablarle al Cronista"}
          className={`${base} ${
            escuchando
              ? "animate-pulse bg-red-500/30 text-red-200 motion-reduce:animate-none"
              : ""
          }`}
        >
          <IconoMicrofono />
        </button>
      )}

      <button
        type="button"
        onClick={onAlternarVoz}
        aria-label={vozActiva ? "Silenciar al Cronista" : "Activar la voz del Cronista"}
        aria-pressed={vozActiva}
        title={vozActiva ? "Silenciar al Cronista" : "Activar la voz del Cronista"}
        className={`${base} ${hablando ? "bg-white/10" : ""}`}
      >
        <IconoBocina activa={vozActiva} />
      </button>
    </>
  );
}