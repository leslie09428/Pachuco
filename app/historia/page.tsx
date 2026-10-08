import { introduccionHistoria, lineaDelTiempo } from "@/lib/contenido/historia";

export const metadata = {
  title: "Historia — Crónicas del Pachuco",
  description:
    "Cronología de la historia pachuca: de la frontera de los años treinta a los Zoot Suit Riots de 1943 y el legado chicano.",
};

export default function PaginaHistoria() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold text-mural-night">
          La historia pachuca
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {introduccionHistoria}
        </p>
      </header>

      <ol className="relative mx-auto mt-12 max-w-3xl space-y-8 border-l-4 border-mural-gold pl-8">
        {lineaDelTiempo.map((hito) => (
          <li key={hito.titulo} className="relative">
            <span
              className={`absolute -left-[2.65rem] top-1.5 h-4 w-4 rounded-full border-4 ${
                hito.destacado
                  ? "border-mural-gold bg-mural-ember"
                  : "border-mural-ember bg-mural-cream"
              }`}
              aria-hidden="true"
            />
            <article
              className={`rounded-lg p-5 shadow-sm ${
                hito.destacado
                  ? "border-2 border-mural-gold bg-mural-night text-mural-cream"
                  : "border border-mural-night/15 bg-mural-card"
              }`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-widest ${
                  hito.destacado ? "text-mural-gold" : "text-mural-ember"
                }`}
              >
                {hito.periodo}
              </p>
              <h2
                className={`mt-1 font-display text-2xl font-bold ${
                  hito.destacado ? "text-mural-cream" : "text-mural-night"
                }`}
              >
                {hito.titulo}
              </h2>
              <p
                className={`mt-3 text-sm leading-relaxed ${
                  hito.destacado ? "text-mural-blush" : "text-muted-foreground"
                }`}
              >
                {hito.texto}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
