# Tegy Webapp Prototype

Tegy is a Harvey-inspired strategy workbench prototype for project-based AI strategy workflows.

The prototype is a static web app with:

- Copilot chat with lane/agent routing
- Live agent-run output previews
- Project-specific Vault context
- Project-filtered Artifacts
- Decision Log
- API setup page for Claude Code and Codex
- Desktop-only narrow-screen gate

## Preview

Current Cloudflare preview:

https://stockings-chubby-thumbzilla-scale.trycloudflare.com/

This preview depends on the local machine and Cloudflare quick tunnel staying online.

## Run Locally

From this folder:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:4173/
```

## Share With Cloudflare Tunnel

With the local server running:

```bash
cloudflared tunnel --url http://127.0.0.1:4173 --no-autoupdate
```

Cloudflare will print a temporary `trycloudflare.com` URL.

## Files

- `index.html` - app shell and page markup
- `styles.css` - responsive UI, dark mode, mobile drawer, and component styling
- `app.js` - prototype state, routing, chat behavior, menus, and interactions
- `preview.png` - reference preview image
- `docs/DEVELOPMENT_SPEC.md` - developer implementation brief for the production web app
- `docs/REPO_ALIGNMENT_BRIEF.md` - repo and architecture alignment notes
- `docs/TEGY_LOCAL_REVIEW.md` - local StrategyOS/Tegy plugin-pack review
- `docs/TEGY_UI_FEATURE_REVIEW.md` - page, feature, and UI review against the local Tegy pack

## Notes

This is a front-end prototype. The AI routing, live agent run, and generated outputs are simulated in-browser for product/UX review.
