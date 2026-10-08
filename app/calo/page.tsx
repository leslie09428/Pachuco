import { GlosarioCalo } from "@/features/calo/glosario-calo";
import { introduccionCalo } from "@/lib/contenido/calo";

export const metadata = {
  title: "El Caló — Crónicas del Pachuco",
  description:
    "Glosario del caló, la lengua del barrio pachuco: saludos, gente, lugares, cosas y expresiones.",
};

export default function PaginaCalo() {
  return (
    <div className="container py-10">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-bold text-mural-night">
          El Caló: la lengua del barrio
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {introduccionCalo}
        </p>
      </header>

      <section className="mt-10">
        <GlosarioCalo />
      </section>
    </div>
  );
}
