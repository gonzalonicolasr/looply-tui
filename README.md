<div align="center">

```
 ╦  ╔═╗╔═╗╔═╗╦  ╦ ╦
 ║  ║ ║║ ║╠═╝║  ╚╦╝
 ╩═╝╚═╝╚═╝╩  ╩═╝ ╩
```

# looply-tui

**La terminal UI de [Looply](https://looply.ceroclawd.com).**
Loop engineer tu IA — desde la terminal.

</div>

---

Un visor de terminal **en vivo** para tus goals de Looply, estilo `k9s`/`lazygit`:
board por lanes, logs en streaming, stats, y un formulario para **crear y
re-correr** goals — sin salir de la consola.

```
┌ LOOPLY ─────────────────────────────────────────────────┐
│ in-flight ◴ 1   success ████░ 80%   24h ▁▂▅█▃   ● runner │
├──────────────────────┬───────────────────────────────────┤
│ IN-FLIGHT 1          │ fix-login            ◆ claude     │
│ ▌◉ fix-login  claude │ active · intento 1/3              │
│ DONE 3               │ ─ logs ─                          │
│   ✓ rfc      ▲ pi    │ [build] compilando…               │
│   ✓ ejemplo  ▲ pi    │ [veredicto] revisando…            │
└──────────────────────┴───────────────────────────────────┘
  ↑↓ goal · ⏎ desc · e re-correr · n nuevo · r refrescar · q salir
```

## Qué hace

- **Board** por lanes (Backlog / In-flight / Done / Failed), navegable con `↑↓`/`jk`.
- **Detail** del goal: logs en vivo vía SSE + history de intentos + veredicto/costo.
- **Crear goals** (`n`): objetivo, repo (con folder-picker que marca cuáles son repos git), criterios, runtime y modo — sin escribir un comando.
- **Re-correr** (`e`): reabre el form **prellenado** con un goal existente; cambiás lo que haga falta y lo encolás de nuevo.

Es read-only sobre la API pública del control-plane (`/goals`, `/runs`, SSE `/events`) + las rutas de escritura autenticadas para crear goals.

## Stack

**[OpenTUI](https://opentui.com)** (`@opentui/react`) + **React 19** + **[Bun](https://bun.com)**.
Sin build step — Bun corre el `.tsx` directo. Toda la lógica (datos, layout, scroll,
formato) está separada del render y testeada.

Tests:
- `vitest` para la capa pura (`lib/` + `data/`)
- `bun test` para los componentes (con el test-renderer headless de OpenTUI)

## Correr

Requisitos: **Bun** y un control-plane de Looply al que apuntar.

```bash
git clone https://github.com/gonzalonicolasr/looply-tui.git
cd looply-tui
bun install

bun run install-cmd      # instala el comando `looply` en ~/.local/bin
looply                   # abrila en cualquier terminal · sale con q
```

Por default pega al control-plane remoto. Para uno local:

```bash
LOOPLY_URL=http://localhost:7475 looply
```

Tests: `bun run test` (corre `vitest` + `bun test`).

## Atajos

| Tecla | Acción |
|---|---|
| `↑↓` / `j` `k` | mover entre goals |
| `⏎` | ver la descripción completa |
| `e` | re-correr el goal (form prellenado) |
| `n` | nuevo goal |
| `PgUp` / `PgDn` | scroll de logs |
| `r` | refrescar | 
| `q` | salir |

---

Parte de **[Looply](https://looply.ceroclawd.com)** — le dás un objetivo, no un
prompt, y corre un loop de agentes (`explore → plan → build → veredicto`) hasta
cumplir el GOAL. Misma familia que CeroClawd y CeroSpace.

<div align="center">

Hecho entre noches y findes por [@gonnicolas](https://www.linkedin.com/in/gonnicolas/) · San Luis, Argentina 🧉

</div>
