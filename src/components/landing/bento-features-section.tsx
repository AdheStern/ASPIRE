import { Activity, Layout, Music2, Sliders, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BentoFeaturesSection() {
  return (
    <section className="bg-gray-50 py-16 md:py-32 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative">
          <div className="relative z-10 grid grid-cols-6 gap-3">
            {/* EQ inteligente */}
            <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
              <CardContent className="relative m-auto size-fit pt-6 text-center">
                <Sliders className="mx-auto size-12" aria-hidden />
                <h2 className="mt-6 text-2xl font-semibold">
                  Sugerencia de Ecualización
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ajustes automáticos de EQ adaptados al ambiente para lograr un
                  balance sonoro.
                </p>
              </CardContent>
            </Card>

            {/* Compresión */}
            <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
              <CardContent className="relative m-auto size-fit pt-6 text-center">
                <Activity className="mx-auto size-12" aria-hidden />
                <h2 className="mt-6 text-2xl font-semibold">
                  Dinámica y Compresión
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Control dinámico preciso para mantener claridad y presencia en
                  todo momento.
                </p>
              </CardContent>
            </Card>

            {/* Reverberación */}
            <Card className="relative col-span-full flex overflow-hidden lg:col-span-2">
              <CardContent className="relative m-auto size-fit pt-6 text-center">
                <Waves className="mx-auto size-12" aria-hidden />
                <h2 className="mt-6 text-2xl font-semibold">
                  Simulación de Reverberación
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Anticipa problemas de claridad reproduciendo el eco natural de
                  tu sala.
                </p>
              </CardContent>
            </Card>

            {/* Instrumentos y efectos */}
            <Card className="relative col-span-full flex overflow-hidden sm:col-span-3 lg:col-span-3">
              <CardContent className="relative m-auto size-fit pt-6 text-center">
                <Music2 className="mx-auto size-12" aria-hidden />
                <h2 className="mt-6 text-2xl font-semibold">
                  Instrumentos y Efectos
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Integra tus instrumentos virtuales y aplica efectos como
                  delay, chorus o filtros para experimentar nuevas sonoridades.
                </p>
              </CardContent>
            </Card>

            {/* Escenarios personalizados */}
            <Card className="relative col-span-full flex overflow-hidden sm:col-span-3 lg:col-span-3">
              <CardContent className="relative m-auto size-fit pt-6 text-center">
                <Layout className="mx-auto size-12" aria-hidden />
                <h2 className="mt-6 text-2xl font-semibold">
                  Escenarios Personalizados
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Guarda configuraciones listas para auditorios o salas pequeñas
                  y cámbialas al instante.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
