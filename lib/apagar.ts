// Apagar: a única operação que remove dados do sistema. Duas formas:
//   - limparAparelho(): zera o que está neste navegador/app (IndexedDB).
//   - apagarConta(): pede ao servidor para apagar TUDO da nuvem (comprovantes,
//     registros, login) e depois limpa o aparelho.
// Exigência da LGPD (eliminação) e da Google Play (conta com login).

import { createStore, clear } from "idb-keyval";
import { contaConfigurada, supabase } from "./supabase";

// Os mesmos nomes usados em store.ts, sync.ts, pagamentos.ts, filhos.ts e
// indices-cache.ts. Se criar um banco novo em algum lugar, acrescente aqui.
const BANCOS_LOCAIS: Array<[string, string]> = [
  ["cofre-db", "registros"],
  ["cofre-blobs", "blobs"],
  ["cofre-sync", "marcas"],
  ["cofre-pagamentos", "pagamentos"],
  ["cofre-combinado", "combinado"],
  ["cofre-filhos", "filhos"],
  ["cofre-indices", "indices"],
];

export async function limparAparelho(): Promise<void> {
  for (const [banco, loja] of BANCOS_LOCAIS) {
    try {
      await clear(createStore(banco, loja));
    } catch {
      // um banco que nunca foi criado neste aparelho: nada a limpar
    }
  }
}

export type ResultadoApagar =
  | { ok: true; registros: number; arquivos: number }
  | { ok: false; motivo: "nao_configurado" | "sem_sessao" | "falhou"; detalhe?: string };

/** Apaga a conta na nuvem (servidor) e, se deu certo, limpa o aparelho e sai. */
export async function apagarConta(): Promise<ResultadoApagar> {
  if (!contaConfigurada()) return { ok: false, motivo: "nao_configurado" };
  const { data } = await supabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) return { ok: false, motivo: "sem_sessao" };

  let r: Response;
  try {
    r = await fetch("/api/apagar-conta", {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ confirmacao: "APAGAR" }),
    });
  } catch {
    return { ok: false, motivo: "falhou", detalhe: "sem conexão" };
  }
  if (r.status === 503) return { ok: false, motivo: "nao_configurado" };
  const corpo = (await r.json().catch(() => ({}))) as { ok?: boolean; registros?: number; arquivos?: number; erro?: string; detalhe?: string };
  if (!r.ok || !corpo.ok) return { ok: false, motivo: "falhou", detalhe: corpo.detalhe ?? corpo.erro };

  await limparAparelho();
  try {
    await supabase().auth.signOut({ scope: "local" });
  } catch {
    // o usuário já não existe na nuvem; a sessão local some de qualquer jeito
  }
  return { ok: true, registros: corpo.registros ?? 0, arquivos: corpo.arquivos ?? 0 };
}
