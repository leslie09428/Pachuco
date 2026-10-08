import { costumbres, introduccionCostumbres } from "@/lib/contenido/costumbres";

export const metadata = {
  title: "Costumbres — Crónicas del Pachuco",
  description:
    "El dance, el swing, el barrio y la elegancia: las costumbres que hicieron del estilo pachuco una cultura viva.",
};

export default function PaginaCostumbres() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold text-mural-night">
          Costumbres del mundo pachuco
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {introduccionCostumbres}
        </p>
      </header>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {costumbres.map((c) => (
          <li
            key={c.titulo}
            className="rounded-lg border-t-8 border-mural-teal bg-mural-card p-6 shadow-sm"
          >
            <span className="text-4xl" aria-hidden="true">
              {c.icono}
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-mural-night">
              {c.titulo}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {c.texto}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
