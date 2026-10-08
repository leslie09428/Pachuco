import Link from "next/link";
import { PachucoScene } from "@/features/pachuco/pachuco-scene";
import { CronistaChat } from "@/features/cronista/cronista-chat";
import { lineaDelTiempo } from "@/lib/contenido/historia";

const secciones = [
  {
    href: "/historia",
    icono: "📅",
    titulo: "Historia",
    texto: "De la frontera de los años treinta a los Zoot Suit Riots de 1943 y el renacer chicano.",
  },
  {
    href: "/calo",
    icono: "📖",
    titulo: "El Caló",
    texto: "El diccionario vivo del habla pachuca: órale, simón, carnal y muchas más.",
  },
  {
    href: "/vestimenta",
    icono: "🎩",
    titulo: "Vestimenta",
    texto: "La anatomía del zoot suit: cada pieza del traco y lo que significaba.",
  },
  {
    href: "/costumbres",
    icono: "🎷",
    titulo: "Costumbres",
    texto: "El dance, el swing, el barrio y la elegancia como forma de orgullo.",
  },
];

export default function PaginaInicio() {
  const destacados = lineaDelTiempo.filter((h) => h.destacado).slice(0, 2);

  return (
    <div>
      {/* Héroe con el pachuco 3D y El Cronista */}
      <section className="bg-[linear-gradient(135deg,#7a2e2e_0%,#9c4a3c_55%,#b96b45_100%)] px-4 py-10 sm:py-14">
        <div className="container grid items-start gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="font-display text-sm uppercase tracking-[0.3em] text-mural-gold">
              Cultura e historia viva
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-mural-cream sm:text-5xl">
              Conoce a los pachucos como nunca antes
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-mural-blush">
              Gira, saluda y baila con nuestro personaje pachuco en 3D, y
              pregúntale a <strong className="text-mural-gold">El Cronista</strong>,
              nuestro asistente de IA, todo sobre la historia, el traje, el
              caló y las costumbres del barrio.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border-2 border-mural-gold/70 bg-mural-night/60">
              <PachucoScene />
              <p className="border-t border-mural-gold/40 px-4 py-2 text-center text-xs text-mural-blush/80">
                Arrastra para girar la cámara · usa la rueda para acercarte
              </p>
            </div>
          </div>
          <div className="lg:sticky lg:top-6">
            <CronistaChat />
            <p className="mt-3 text-center text-xs text-mural-blush/80">
              El Cronista responde con información histórica verificada de este
              sitio.
            </p>
          </div>
        </div>
      </section>

      {/* Accesos a las secciones */}
      <section className="container py-12">
        <h2 className="font-display text-3xl font-bold text-mural-night">
          Explora las crónicas
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {secciones.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-lg border border-mural-night/15 bg-mural-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-mural-gold hover:shadow-md"
            >
              <span className="text-3xl" aria-hidden="true">
                {s.icono}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold text-mural-night group-hover:text-mural-ember">
                {s.titulo}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.texto}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Momentos destacados */}
      <section className="bg-mural-teal px-4 py-12">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-mural-cream">
            Momentos que marcaron una comunidad
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {destacados.map((hito) => (
              <article
                key={hito.titulo}
                className="rounded-lg border-l-8 border-mural-gold bg-mural-night/70 p-6"
              >
                <p className="text-sm font-bold uppercase tracking-widest text-mural-gold">
                  {hito.periodo}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold text-mural-cream">
                  {hito.titulo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mural-blush">
                  {hito.texto}
                </p>
              </article>
            ))}
          </div>
          <Link
            href="/historia"
            className="mt-6 inline-block rounded-full bg-mural-gold px-6 py-2.5 text-sm font-bold text-mural-night transition hover:bg-mural-gold/85"
          >
            Ver la cronología completa →
          </Link>
        </div>
      </section>
    </div>
  );
}
