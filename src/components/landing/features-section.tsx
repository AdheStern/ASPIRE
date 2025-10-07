import { AudioWaveform, Cable, ScanLine } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Diseña tu experiencia sonora
          </h2>
          <p className="mt-4">
            Escanea, organiza y simula tus espacios para obtener la mejor
            acústica posible.
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]">
          <Card className="group border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <ScanLine className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Escanea tu ambiente</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Captura la geometría del lugar mediante un escaneo 3D o un
                dibujo 2D.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Cable className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Organiza tus equipos</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Añade micrófonos, parlantes e instrumentos y visualiza su
                disposición.
              </p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <AudioWaveform className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Simula el sonido</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Obtén predicciones acústicas y sugerencias para optimizar la
                mezcla.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-75%"
    />
    <div className="dark:bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t bg-white">
      {children}
    </div>
  </div>
);
