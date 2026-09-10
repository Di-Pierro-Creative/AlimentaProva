"use client";

// Perfil da genitora: os filhos (com o perfil de cada um a um toque), a conta
// na nuvem, privacidade e apagar. É a porta de entrada para tudo que não é
// registrar despesa ou pensão. Aberto pelo botão "Perfil" do cabeçalho.

import { useEffect, useState } from "react";
import Link from "next/link";
import { idade, listarFilhosComRetirados } from "@/lib/filhos";
import { aoMudarSessao, type Sessao } from "@/lib/conta";
import { contaConfigurada } from "@/lib/supabase";
import { observarSync, type EstadoSync } from "@/lib/sync";
import { VERSAO } from "@/lib/versao";
import type { FilhoAtual } from "@/lib/types";

export default function Perfil() {
  const [filhos, setFilhos] = useState<FilhoAtual[] | null>(null);
  const [sessao, setSessao] = useState<Sessao | null | undefined>(undefined);
  const [sync, setSync] = useState<EstadoSync | null>(null);
  const configurada = contaConfigurada();

  useEffect(() => {
    const carregar = () => listarFilhosComRetirados().then(setFilhos).catch(() => setFilhos([]));
    carregar();
    window.addEventListener("cofre:sincronizou", carregar);
    return () => window.removeEventListener("cofre:sincronizou", carregar);
  }, []);
  useEffect(() => aoMudarSessao(setSessao), []);
  useEffect(() => observarSync(setSync), []);

  const ativos = (filhos ?? []).filter((f) => !f.retirada);
  const retirados = (filhos ?? []).filter((f) => f.retirada).length;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="safe-t sticky top-0 z-10 flex items-center justify-between border-b border-rule bg-paper/95 px-4 pb-3 backdrop-blur">
        <Link href="/" className="-ml-2 rounded-lg px-2 py-2 text-sm font-medium text-ink-2 active:bg-rule/50" aria-label="Voltar">
          ← Voltar
        </Link>
        <h1 className="text-base font-semibold">Perfil</h1>
        <span className="w-16" aria-hidden="true" />
      </header>

      <main className="flex-1 space-y-6 px-4 pb-16 pt-4">
        {/* Filhos */}
        <section aria-labelledby="perfil-filhos">
          <div className="mb-2 flex items-baseline justify-between">
            <h2 id="perfil-filhos" className="text-xs font-semibold uppercase tracking-wide text-ink-3">
              Filhos{ativos.length ? ` · ${ativos.length}` : ""}
            </h2>
            {retirados > 0 && (
              <Link href="/filhos" className="text-xs font-medium text-accent">
                {retirados} retirado{retirados > 1 ? "s" : ""} ›
              </Link>
            )}
          </div>

          {filhos === null && <p className="py-4 text-center text-sm text-ink-3">Abrindo…</p>}

          {filhos !== null && (
            <div className="overflow-hidden rounded-2xl border border-rule bg-surface">
              {ativos.length === 0 && (
                <p className="px-4 py-3 text-sm text-ink-2">
                  Nenhum filho cadastrado. Com o cadastro, cada despesa diz de quem é, e a planilha e o relatório saem por filho. Só o
                  nome já basta.
                </p>
              )}
              <ul className="divide-y divide-rule">
                {ativos.map((f) => {
                  const detalhes = [idade(f.nascimento), f.roupa ? `roupa ${f.roupa}` : "", f.calcado ? `calçado ${f.calcado}` : "", f.escola]
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <li key={f.id}>
                      <Link href={`/filhos/${f.linhagem}`} className="flex items-center gap-3 px-4 py-3 active:bg-rule/40">
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-base font-semibold text-accent"
                          aria-hidden="true"
                        >
                          {f.nome.slice(0, 1).toUpperCase()}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{f.nome}</span>
                          {detalhes && <span className="block truncate text-xs text-ink-3">{detalhes}</span>}
                        </span>
                        <span className="shrink-0 text-xs font-medium text-accent">editar ›</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/filhos/novo"
                className={["flex h-12 items-center justify-center gap-2 text-sm font-semibold text-accent active:bg-accent-soft", ativos.length ? "border-t border-rule" : ""].join(" ")}
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  ＋
                </span>
                Cadastrar filho
              </Link>
            </div>
          )}
          {ativos.length === 1 && <p className="mt-1 text-[11px] text-ink-3">Com dois ou mais filhos, cada despesa pergunta de quem é.</p>}
        </section>

        {/* Conta */}
        <section aria-labelledby="perfil-conta">
          <h2 id="perfil-conta" className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">
            Conta na nuvem
          </h2>
          <Link href="/conta" className="flex items-center justify-between rounded-2xl border border-rule bg-surface px-4 py-3 active:bg-rule/40">
            <span className="min-w-0">
              {!configurada && <span className="block text-sm font-semibold">Só neste aparelho</span>}
              {configurada && sessao === undefined && <span className="block text-sm text-ink-3">Verificando…</span>}
              {configurada && sessao === null && (
                <>
                  <span className="block text-sm font-semibold">Entrar com e-mail</span>
                  <span className="block text-xs text-ink-3">Cópia na nuvem e o cofre igual em qualquer aparelho</span>
                </>
              )}
              {configurada && sessao && (
                <>
                  <span className="block truncate text-sm font-semibold">{sessao.email}</span>
                  <span className="block text-xs text-ink-3">
                    {sync?.estado === "ok" && "Tudo na nuvem"}
                    {sync?.estado === "sincronizando" && "Sincronizando…"}
                    {sync?.estado === "erro" && "Sem conexão — sincroniza quando voltar"}
                    {(!sync || sync.estado === "deslogado") && "Conectada"}
                    {sync?.pendentes ? ` · ${sync.pendentes} só aqui` : ""}
                  </span>
                </>
              )}
            </span>
            <span className="shrink-0 text-xs font-medium text-accent">{configurada && sessao ? "ver ›" : "abrir ›"}</span>
          </Link>
        </section>

        {/* Privacidade */}
        <section aria-labelledby="perfil-privacidade">
          <h2 id="perfil-privacidade" className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-3">
            Seus dados
          </h2>
          <div className="divide-y divide-rule overflow-hidden rounded-2xl border border-rule bg-surface text-sm">
            <Link href="/exportar" className="flex items-center justify-between px-4 py-3 active:bg-rule/40">
              <span>Exportar tudo (planilha, pasta, relatório)</span>
              <span className="text-ink-3" aria-hidden="true">
                ›
              </span>
            </Link>
            <Link href="/privacidade" className="flex items-center justify-between px-4 py-3 active:bg-rule/40">
              <span>Política de privacidade</span>
              <span className="text-ink-3" aria-hidden="true">
                ›
              </span>
            </Link>
            <Link href="/apagar-conta" className="flex items-center justify-between px-4 py-3 text-risk active:bg-rule/40">
              <span>Apagar conta ou dados</span>
              <span className="text-ink-3" aria-hidden="true">
                ›
              </span>
            </Link>
          </div>
        </section>

        <p className="text-center text-[11px] text-ink-3">AlimentaProva · versão {VERSAO}</p>
      </main>
    </div>
  );
}
