"use client";

import { useMemo, useState } from "react";
import {
  categoriasCalo,
  glosarioCalo,
  type CategoriaCalo,
} from "@/lib/contenido/calo";

export function GlosarioCalo() {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState<CategoriaCalo | "Todas">("Todas");

  const resultados = useMemo(() => {
    const limpia = busqueda
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return glosarioCalo.filter((e) => {
      const enCategoria =
        categoria === "Todas" || e.categoria === categoria;
      const enBusqueda =
        limpia.length === 0 ||
        e.palabra.toLowerCase().includes(limpia) ||
        e.significado.toLowerCase().includes(limpia);
      return enCategoria && enBusqueda;
    });
  }, [busqueda, categoria]);

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <label htmlFor="buscar-calo" className="sr-only">
          Buscar palabra en el glosario
        </label>
        <input
          id="buscar-calo"
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar una palabra: órale, carnal, feria…"
          className="w-full rounded-full border-2 border-mural-night/20 bg-mural-card px-5 py-3 text-sm shadow-sm focus:border-mural-gold focus:outline-none"
        />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {(["Todas", ...categoriasCalo] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                categoria === c
                  ? "border-mural-gold bg-mural-gold text-mural-night"
                  : "border-mural-night/25 bg-mural-card text-mural-night hover:border-mural-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {resultados.length === 0 ? (
        <p className="mx-auto mt-10 max-w-md rounded-lg border border-dashed border-mural-night/30 bg-mural-card p-6 text-center text-sm text-muted-foreground">
          Nel, no encontré esa palabra. Prueba con «órale», «chante» o «jaina»,
          o cambia la categoría.
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((e) => (
            <li
              key={e.palabra}
              className="rounded-lg border-l-8 border-mural-gold bg-mural-card p-5 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-display text-2xl font-bold text-mural-night">
                  {e.palabra}
                </h3>
                <span className="shrink-0 rounded-full bg-mural-teal/15 px-2 py-0.5 text-[11px] font-semibold text-mural-teal">
                  {e.categoria}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {e.significado}
              </p>
              <p className="mt-3 border-t border-mural-night/10 pt-3 text-sm italic text-mural-ember">
                {e.ejemplo}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
