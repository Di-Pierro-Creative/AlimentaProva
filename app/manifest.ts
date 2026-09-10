import type { MetadataRoute } from "next";

// Manifesto do PWA. É o que o Android (e o PWABuilder, para a Play Store) lê:
// nome, ícones, cor, tela cheia. `id` fixa a identidade do app mesmo se a
// start_url mudar; `scope` diz que tudo neste endereço é o app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    scope: "/",
    name: "AlimentaProva — despesas do seu filho e pensão, comprovadas",
    short_name: "AlimentaProva",
    description:
      "Registre as despesas do seu filho com comprovante e a pensão que entra. Quando o advogado pedir, exporte a pasta pronta.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f4f6",
    theme_color: "#1f4d8f",
    lang: "pt-BR",
    dir: "ltr",
    categories: ["finance", "productivity", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
    shortcuts: [
      { name: "Registrar despesa", short_name: "Despesa", url: "/nova", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
      { name: "Registrar pensão", short_name: "Pensão", url: "/pensao/novo", icons: [{ src: "/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
