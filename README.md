# Little Sandbox

A small, open-ended 3D browser game with a 28×28 sandbox and 16 randomly placed sand piles. Choose a toy and move sand around a wooden sandbox. No scores, timers, or objectives.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For another device on the same Wi-Fi, use the printed network URL.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`, which tests and builds the game and publishes **only `dist/`** on pushes to `main` (or a manual workflow run).

1. Commit and push these changes to GitHub.
2. In the repository, open **Settings → Pages → Build and deployment**, and set **Source** to **GitHub Actions**.
3. Run **Deploy sandbox to GitHub Pages** from the Actions tab, or push another change to `main`.
4. Open the URL shown by the successful deployment.

Do not deploy the repository root directly: its `index.html` references source modules that require Vite. `vite.config.js` uses relative built asset URLs, so the same build works under a repository path such as `/sandbox/` or at a custom domain's root. See [Vite's Pages deployment guide](https://vite.dev/guide/static-deploy#github-pages).

To check the deployable files locally:

```sh
npm run build
node scripts/check-pages.mjs
npm run preview
```

The asset check verifies that compiled JavaScript and CSS resolve within a repository subpath. For other static hosts, upload the contents of `dist/`.

To roll back, revert the unwanted commit and push to `main`; the workflow rebuilds and redeploys the reverted version. Check that the workflow succeeds and the game loads at its Pages URL.

## Play

- **1 / 2 / 3** or the toy cards: select the bulldozer, digger, or dump truck. You can also click a toy in the scene.
- The camera stays in third person behind the selected toy, follows steering, and switches immediately when you choose another vehicle.
- **W / S**: forward / reverse. **A / D**: steer.
- **Bulldozer — Space**: lower or raise the blade. Drive forward with the blade down to push sand into piles.
- **Digger — I / K**: scoop / release. Each scoop stays in the bucket until released. Release close to the dump truck to load its bed.
- **Dump truck — Space**: tip or lower the bed. Driving with the bed down collects sand; tipping deposits the load behind the truck.
- Touch devices show driving arrows and the same action buttons. Hold arrows to drive or steer; you can hold two at once.
- The circular arrow resets the scene with fresh random piles after confirmation. The question mark opens controls and pauses play.

Only the selected toy moves or operates. Walls and other vehicles block movement. Sand volume is conserved across terrain, buckets, and truck loads. Reloading starts a fresh sandbox; this version does not save sessions.

## Checks

```sh
npm test
npm run build
```

Built with Three.js and Vite. The terrain uses a deformable height field with local volume transfers, rather than individual sand-grain physics. Requires a WebGL 2 browser. Google Fonts are optional; local fallback fonts work offline after the app is loaded.
