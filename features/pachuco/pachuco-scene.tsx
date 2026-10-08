"use client";

import dynamic from "next/dynamic";

/**
 * El personaje 3D solo se renderiza en el navegador (usa WebGL), por eso
 * se carga de forma dinámica sin SSR, con un estado de carga honesto.
 */
const Pachuco3D = dynamic(() => import("./pachuco-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-mural-gold/30 border-t-mural-gold" />
      <p className="font-display text-sm text-mural-blush">
        El pachuco está llegando al salón…
      </p>
    </div>
  ),
});

export function PachucoScene() {
  return (
    <div className="h-[420px] w-full sm:h-[520px]">
      <Pachuco3D />
    </div>
  );
}
