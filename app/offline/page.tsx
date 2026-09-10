import Link from "next/link";

// Página que o service worker mostra quando não há internet e a tela pedida
// ainda não foi aberta neste aparelho. O que já foi aberto continua funcionando.

export const metadata = { title: "Sem conexão — AlimentaProva" };

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8.5a15 15 0 0 1 20 0" />
          <path d="M5 12a10 10 0 0 1 14 0" />
          <path d="M8.5 15.5a5 5 0 0 1 7 0" />
          <circle cx="12" cy="19" r="1" fill="currentColor" />
          <path d="M3 3l18 18" />
        </svg>
      </div>
      <h1 className="text-lg font-semibold">Sem conexão</h1>
      <p className="mx-auto mt-2 max-w-xs text-sm text-ink-2">
        Esta tela ainda não foi aberta neste aparelho. O que você já registrou continua guardado; as telas que você já usou abrem
        normalmente.
      </p>
      <Link href="/" className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-accent px-6 text-sm font-semibold text-white">
        Ir para as despesas
      </Link>
    </div>
  );
}
