"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

const enlaces = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/historia", etiqueta: "Historia" },
  { href: "/calo", etiqueta: "El Caló" },
  { href: "/vestimenta", etiqueta: "Vestimenta" },
  { href: "/costumbres", etiqueta: "Costumbres" },
];

export function AppShell({ children }: PropsWithChildren) {
  const ruta = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-4 border-mural-gold bg-mural-night">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-wide text-mural-gold sm:text-2xl"
          >
            ✦ CRÓNICAS DEL PACHUCO ✦
          </Link>
          <nav aria-label="Secciones">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              {enlaces.map((e) => {
                const activo =
                  e.href === "/" ? ruta === "/" : ruta.startsWith(e.href);
                return (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      className={
                        activo
                          ? "font-bold text-mural-gold underline decoration-mural-gold decoration-2 underline-offset-4"
                          : "text-mural-cream/85 transition hover:text-mural-gold"
                      }
                    >
                      {e.etiqueta}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t-4 border-mural-gold bg-mural-night px-4 py-6 text-center">
        <p className="text-sm text-mural-cream/80">
          Crónicas del Pachuco — difusión cultural con personaje 3D e
          inteligencia artificial, inspirada en proyectos como Don Quijote IA.
        </p>
        <p className="mt-1 text-xs text-mural-blush/60">
          Proyecto en desarrollo · Historia, vestimenta, lenguaje y costumbres
          de los pachucos
        </p>
      </footer>
    </div>
  );
}
