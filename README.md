# Little Sandbox

A small, open-ended 3D browser game. Choose a toy and move sand around a wooden sandbox. No scores, timers, or objectives.

## Run

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For another device on the same Wi-Fi, use the printed network URL.

## Play

- **1 / 2 / 3** or the toy cards: select the bulldozer, digger, or dump truck. You can also click a toy in the scene.
- **W / S**: forward / reverse. **A / D**: steer.
- **Bulldozer — Space**: lower or raise the blade. Drive forward with the blade down to push sand into piles.
- **Digger — I / K**: scoop / release. Each scoop stays in the bucket until released. Release close to the dump truck to load its bed.
- **Dump truck — Space**: tip or lower the bed. Driving with the bed down collects sand; tipping deposits the load behind the truck.
- Touch devices show driving arrows and the same action buttons. Hold arrows to drive or steer; you can hold two at once.
- The circular arrow resets the scene after confirmation. The question mark opens controls and pauses play.

Only the selected toy moves or operates. Walls and other vehicles block movement. Sand volume is conserved across terrain, buckets, and truck loads. Reloading starts a fresh sandbox; this version does not save sessions.

## Checks

```sh
npm test
npm run build
```

Built with Three.js and Vite. The terrain uses a deformable height field with local volume transfers, rather than individual sand-grain physics. Requires a WebGL 2 browser. Google Fonts are optional; local fallback fonts work offline after the app is loaded.
