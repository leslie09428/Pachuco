import {
  introduccionVestimenta,
  piezasZootSuit,
  pachucasVestimenta,
} from "@/lib/contenido/vestimenta";

export const metadata = {
  title: "Vestimenta — Crónicas del Pachuco",
  description:
    "La anatomía del zoot suit: cada pieza del traco pachuco y lo que significaba.",
};

export default function PaginaVestimenta() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold text-mural-night">
          El traco: anatomía del zoot suit
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {introduccionVestimenta}
        </p>
      </header>

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {piezasZootSuit.map((pieza, i) => (
          <li
            key={pieza.pieza}
            className="relative overflow-hidden rounded-lg border border-mural-night/15 bg-mural-card p-6 shadow-sm"
          >
            <span
              className="absolute -right-3 -top-5 font-display text-7xl font-bold text-mural-gold/25"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h2 className="font-display text-2xl font-bold text-mural-night">
              {pieza.pieza}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {pieza.descripcion}
            </p>
            <p className="mt-4 rounded-md bg-mural-teal/10 p-3 text-sm italic leading-relaxed text-mural-teal">
              {pieza.significado}
            </p>
          </li>
        ))}

        <li className="rounded-lg border-2 border-mural-rose/60 bg-mural-card p-6 shadow-sm md:col-span-2">
          <h2 className="font-display text-2xl font-bold text-mural-night">
            {pachucasVestimenta.pieza}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">
            {pachucasVestimenta.descripcion}
          </p>
          <p className="mt-4 rounded-md bg-mural-rose/10 p-3 text-sm italic leading-relaxed text-mural-ember">
            {pachucasVestimenta.significado}
          </p>
        </li>
      </ul>
    </div>
  );
}
