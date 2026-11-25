# Agent 101

A 53-slide self-study course on how a large language model becomes a chatbot, looks
things up and writes and runs code: chat templates, tool use, RAG, the agent loop,
coding agents, context and memory, multi-agent systems, evaluation and safety.

Live at https://khanhnd61-vr.github.io/agent101/

There is no build step: open `index.html`, or serve the folder with any static server.

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

| Path | What it holds |
|---|---|
| `index.html` | The 53 slides, one `<section>` each, and the toolbar |
| `assets/deck.css` | The look of the slides and their entrance animations |
| `assets/viewer.css` | The page around the slides: stage, element defaults, toolbar |
| `assets/viewer.js` | Paging, scaling to the window, and restarting a slide's animations when it is shown |

## Reading it

| Key | Action |
|---|---|
| → ↓ Space Enter PageDown | Next slide |
| ← ↑ Backspace PageUp | Previous slide |
| Home / End | First / last slide |
| R | Replay the current slide's animations |
| F | Full screen |

A slide's address is `#slide-N`, so `…/agent101/#slide-27` opens the agent loop.

## Parts

| Slides | Part |
|---|---|
| 1–3 | Opening |
| 4–8 | 1 · From LLM to chatbot |
| 9–14 | 2 · Tool use |
| 15–23 | 3 · Retrieval-augmented generation |
| 24–30 | 4 · The agent loop |
| 31–36 | 5 · Coding agents |
| 37–41 | 6 · Context and memory |
| 42–46 | 7 · Multi-agent systems |
| 47–51 | 8 · Evaluation and safety |
| 52–53 | Recap and next steps |
