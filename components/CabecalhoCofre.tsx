"use client";

// Cabeçalho da tela inicial: nome, Perfil (com o estado da conta num ponto),
// Exportar e as duas abas (Despesas = o que sai · Pensão = o que entra).

import { useEffect, useState } from "react";
import Link from "next/link";
import { observarSync, type EstadoSync } from "@/lib/sync";

export type Aba = "despesas" | "pensao";

export default function CabecalhoCofre({ aba }: { aba: Aba }) {
  const [sync, setSync] = useState<EstadoSync | null>(null);
  useEffect(() => observarSync(setSync), []);

  // O ponto ao lado de "Perfil" resume a conta: cinza = só no aparelho,
  // azul = precisa entrar, verde = na nuvem, âmbar = sincronizando, vermelho = sem conexão.
  const estado = sync?.estado ?? "sem_conta";
  const ponto =
    estado === "ok" ? "bg-ok" : estado === "sincronizando" ? "bg-accent animate-pulse" : estado === "erro" ? "bg-risk" : estado === "deslogado" ? "bg-accent" : "bg-ink-3";
  const legenda =
    estado === "ok"
      ? "conta na nuvem, tudo sincronizado"
      : estado === "sincronizando"
        ? "sincronizando"
        : estado === "erro"
          ? "sem conexão com a nuvem"
          : estado === "deslogado"
            ? "entre na conta para ter cópia na nuvem"
            : "dados só neste aparelho";

  return (
    <header className="safe-t sticky top-0 z-10 border-b border-rule bg-paper/95 px-4 pb-2 backdrop-blur">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight">AlimentaProva</h1>
        <div className="-mr-2 flex items-center gap-1 text-sm font-semibold text-accent">
          <Link href="/perfil" className="flex items-center gap-1.5 rounded-lg px-2 py-2 active:bg-rule/50" title={legenda}>
            <PessoaIcon />
            Perfil
            <span className={["h-2 w-2 rounded-full", ponto].join(" ")} aria-hidden="true" />
            <span className="sr-only">— {legenda}</span>
          </Link>
          <Link href="/exportar" className="rounded-lg px-2 py-2 active:bg-rule/50">
            Exportar
          </Link>
        </div>
      </div>
      <nav className="mt-2 grid grid-cols-2 rounded-xl bg-rule/60 p-0.5 text-sm font-semibold" aria-label="Seções">
        <AbaLink href="/" ativa={aba === "despesas"}>
          Despesas
        </AbaLink>
        <AbaLink href="/pensao" ativa={aba === "pensao"}>
          Pensão
        </AbaLink>
      </nav>
    </header>
  );
}

function AbaLink({ href, ativa, children }: { href: string; ativa: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={ativa ? "page" : undefined}
      className={["h-9 rounded-[10px] text-center leading-9", ativa ? "bg-surface text-ink shadow-sm" : "text-ink-3"].join(" ")}
    >
      {children}
    </Link>
  );
}

function PessoaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
