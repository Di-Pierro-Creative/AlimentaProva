# AlimentaProva

Cofre de provas para pensão alimentícia. Quem administra a pensão registra cada despesa do filho (com comprovante — de hoje ou de meses atrás; a data vem do comprovante) e cada pagamento de pensão que entra — e, quando o advogado pedir, exporta a pasta pronta.

Código: github.com/Di-Pierro-Creative/AlimentaProva · Publicado em https://alimentaprova.vercel.app → domínio definitivo **alimentaprova.app** (PWA instalável; Play Store via TWA — ver "Loja").

## Princípios que o código carrega

- **Append-only.** Nada é apagado nem sobrescrito (a única exceção é **apagar a conta inteira**, direito da pessoa — LGPD — e exigência da Google Play). Editar cria uma nova versão; "retirar" é uma versão marcada, com motivo obrigatório, reversível. Na nuvem isso é garantido pelo banco (só ler e inserir — não existe permissão de alterar nem apagar).
- **Duas datas por registro:** `data_do_fato` (quando aconteceu) e `criado_em` (quando entrou no cofre). Na nuvem, ainda `recebido_em` (relógio do servidor).
- **Selo:** SHA-256 de cada comprovante, calculado no aparelho no momento do registro. A chave do arquivo é o próprio hash.
- **O app registra; quem julga é o advogado.** Rateio, valor combinado, custo × pensão: o app mostra os números que a pessoa declarou, sem sugerir percentual nem concluir o que é "devido".
- **Local primeiro.** Tudo funciona no aparelho, offline, sem conta. A conta (Supabase) é a cópia que junta os aparelhos e, depois, o que o advogado vai ver.
- **Baixar os próprios arquivos é grátis, sempre.**

## O que faz

**Perfil** (botão no cabeçalho) — filhos, conta na nuvem, exportar, privacidade, apagar.

**Filhos** — perfil por filho (nome, nascimento → idade, tamanhos, escola). Cada despesa diz de quem é; lista, planilha e relatório saem por filho. Uma pensão cobre todos os filhos (irmãos do mesmo pai).

**Despesas** — foto/print do comprovante → leitura automática (valor, data, categoria sugerida) → conferir → guardar. Print de fatura de cartão vira vários registros, um por lançamento, com o mesmo comprovante. Rateio: quando só uma parte é do filho (restaurante, mercado), grava o total, o percentual e o critério.

**Pensão** — cada pagamento recebido (print do Pix/extrato, valor, data, mês a que se refere, forma). Valor combinado/fixado — em reais ou em % do salário mínimo — com dia de vencimento e vigência; cada mês mostra combinado × recebido. Gráfico custo do filho × pensão recebida. **Atrasados atualizados** com memória de cálculo (INPC/IPCA + juros, à escolha; recorte das 3 últimas prestações do art. 528, § 7º).

**Exportar** — planilha .csv, pasta .zip (planilha de despesas, pagamentos, custo × pensão mês a mês, comprovantes renomeados `data_categoria_valor_selo.ext`, LEIA-ME com os selos), relatório imprimível (PDF), envio direto para o Google Drive da cliente com acesso de leitura ao advogado.

**Conta** — entrar por e-mail + código de 6 dígitos; sincronização automática entre aparelhos. **Apagar conta** (tela Conta ou `/apagar-conta`): digita APAGAR → o servidor remove comprovantes, registros e o login; o aparelho é limpo. **Privacidade** em `/privacidade`.

**Offline** — service worker (`public/sw.js`): arquivos do app em cache; páginas já abertas funcionam sem internet; `/offline` quando não há cópia.

## Rodar

```bash
npm install
npm run dev
```

Variáveis de ambiente (todas opcionais — sem elas o app funciona no modo manual, só no aparelho): ver `.env.example`.

Banco da conta: colar `supabase/schema.sql` no SQL Editor do projeto Supabase (uma vez).

## Loja (Google Play, via TWA)

O app entra na Play Store como está, empacotado pelo [PWABuilder](https://www.pwabuilder.com) (tecnologia Trusted Web Activity da própria Google). Ordem:

1. **Domínio.** Comprar `alimentaprova.app` (Vercel → Domains) e marcá-lo como principal em Settings → Domains. O pacote da loja fica amarrado ao endereço — decidir antes de empacotar. Depois, no Supabase: Authentication → URL Configuration → Site URL = `https://alimentaprova.app`.
2. **Nuvem funcionando.** Supabase com SMTP, variáveis no Vercel (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, **`SUPABASE_SERVICE_ROLE_KEY`** — esta última é segredo, só no Vercel) e login testado.
3. **Conta no Play Console** (US$ 25, uma vez) como **organização** (Di Pierro Creative): pede número D-U-N-S (gratuito em dnb.com, leva dias). Conta de organização não tem a exigência de 12 testadores por 14 dias que vale para contas pessoais novas.
4. **Pacote.** pwabuilder.com → colar `https://alimentaprova.app` → Package for stores → Android. Preencher: Package ID `app.alimentaprova.twa`, nome, versão, cores; deixar "Signing key: new" na primeira vez. **Baixar e guardar o zip com a chave de assinatura em lugar seguro** (sem ela não dá para atualizar o app). Dentro vem `.aab` (para a loja), `.apk` (para testar no celular) e o `assetlinks.json`.
5. **assetlinks.** Colar o conteúdo em `public/.well-known/assetlinks.json` (instruções em `public/.well-known/LEIA-ME.txt`). Sem isso o app abre com a barra do Chrome.
6. **Play Console.** Criar o app → subir o `.aab` em Testing → Internal (testar) → Production. Preencher: ficha da loja (nome, descrição curta/longa, ícone 512 — `public/icon-maskable-512.png` —, capturas de tela do celular, pelo menos 2), **política de privacidade = `https://alimentaprova.app/privacidade`**, classificação de conteúdo (questionário), público-alvo (18+), **Data safety** (coleta: e-mail; fotos/arquivos e informações financeiras do usuário — despesas e pagamentos —, criptografados em trânsito, com opção de apagar; link de apagar conta = `https://alimentaprova.app/apagar-conta`), declaração de que não há anúncios.
7. Depois que a Play assinar o app, acrescentar a impressão digital dela ao `assetlinks.json` (ver LEIA-ME).

iPhone: por enquanto, "Adicionar à Tela de Início" no Safari. A App Store recusa app que é "site empacotado" (regra 4.2); entrar lá exige função nativa, Mac com Xcode e US$ 99/ano — decisão para depois.

## Estrutura

```
app/                      rotas (App Router)
  page.tsx                aba Despesas          → components/ListaDespesas
  pensao/                 aba Pensão            → components/Pensao
  pensao/novo             registrar pagamento   → components/CapturaPagamento
  pensao/combinado        valor combinado       → components/Combinado
  pensao/atrasados        atrasados atualizados → components/Atrasados
  pagamento/[id]          detalhe do pagamento  → components/DetalhePagamento
  nova/                   registrar despesa     → components/CapturaDespesa
  despesa/[id]            detalhe da despesa    → components/DetalheDespesa
  exportar/, relatorio/   exportação            → components/Exportar, Relatorio
  filhos/, filhos/novo, filhos/[id]   perfis dos filhos → components/Filhos, FilhoTela
  perfil/                 perfil da genitora: filhos, conta, dados → components/Perfil
  conta/                  conta (+ apagar)      → components/Conta
  apagar-conta/           link público p/ apagar a conta (exigência da loja)
  privacidade/            política de privacidade (LGPD)
  offline/                tela do service worker sem internet
  api/apagar-conta        apaga nuvem + login (chave de serviço; só servidor)
  api/ler-comprovante     leitura automática (servidor)
  api/indices             INPC e IPCA do IBGE, com cache (servidor)
components/
  CabecalhoCofre          cabeçalho: Perfil (ponto = estado da conta), Exportar, abas
  GraficoCustoPensao      gráfico custo × pensão (SVG, sem biblioteca)
  SeletorFilho            chips "de quem é" (usado na captura e na edição)
  RateioPainel, Sincronizador, Offline (liga o service worker)
lib/
  types.ts                modelo de dados — a "etiqueta" de cada registro
  store.ts                despesas: armazenamento append-only (IndexedDB)
  pagamentos.ts           pagamentos e valor combinado (IndexedDB)
  filhos.ts               perfis dos filhos (IndexedDB) + idade, nomes
  pensao.ts               contas mês a mês: devido × recebido, série custo × pensão
  atrasados.ts            memória de cálculo dos atrasados (correção + juros)
  indices.ts, indices-cache.ts, salario-minimo.ts   INPC/IPCA embutidos + busca no IBGE; tabela do salário mínimo
  exportar.ts, zip.ts     planilhas, pasta, índice; gerador ZIP
  drive.ts                Google Drive
  supabase.ts, conta.ts, sync.ts   conta e sincronização
  apagar.ts               apagar conta / limpar aparelho
  rateio.ts, format.ts, hash.ts, imagem.ts, categorias.ts   utilitários
supabase/schema.sql       banco e storage da conta (RLS: só ler e inserir)
public/sw.js              service worker (offline)
public/icon-*.png         ícones PWA / loja (gerados de icon.svg)
public/.well-known/       assetlinks.json da Play Store (+ LEIA-ME)
```
