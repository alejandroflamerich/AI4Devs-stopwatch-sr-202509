Title: Alejandro Flamerich solved stopwatch exercise — UI & logic

Summary
-------
This PR implements the stopwatch and countdown exercise requested. It adds a complete example app in `stopwatch-AF/` and updates the `template/` to visually match the provided reference (`stopwatch.png`) and include Start/Clear behavior.

Files changed / added
--------------------
- template/index.html — updated layout to match the reference (large display, Start/Clear buttons) and credit "Hecho por Alejandro Flamerich".
- template/styles.css — styles to center the template and reproduce the appearance in `stopwatch.png`.
- template/script.js — simple Start/Clear countdown logic (beep on finish + optional Notification).
- stopwatch-AF/index.html — full multi-timer UI (create/manage timers)
- stopwatch-AF/styles.css — styles for the multi-timer app
- stopwatch-AF/script.js — multi-timer logic: create, start/pause, reset, delete, persistent storage, notifications and audio alert
- stopwatch-AF/prompts.md — prompt engineering record (initial prompt, refinements, final prompt)
- stopwatch-AF/chatbot.md — notes on chatbot interactions and developer interventions

How to test locally
--------------------
1. Open `template/index.html` in a modern browser (Chrome, Edge, Firefox). You can double-click the file or run from PowerShell:

```powershell
ii .\template\index.html
```

2. The page shows a large time display (default `00:08:00`).
3. Click `Start` to begin the countdown, `Pause` to pause, and `Clear` to reset to the initial value.
4. When the countdown finishes you should hear a beep. If you allow notifications, a browser notification is attempted.

For the multi-timer app:
1. Open `stopwatch-AF/index.html`.
2. Create cronómetros or cuentas regresivas, manage each timer (start/pause/reset/delete). Countdown timers play a beep and show a notification when they finish.

Prompt final (to paste in PR comment)
----------------------------------
Genera una app web estática en carpeta `stopwatch-AF` con `index.html`, `styles.css`, `script.js`, `prompts.md` y `chatbot.md`. Requisitos exactos: múltiples timers (cronómetro o countdown), interfaz para crear (tipo, etiqueta, duración HH:MM:SS), botones iniciar/pausa/reset/eliminar por timer, persistencia en localStorage, notificaciones al finalizar (Notification API) y sonido (WebAudio). La UI debe ser simple y responsive. Incluye manejo de permisos de notificación y fallback si no soportado. Entrega archivos listos para PR.

Notes and considerations
------------------------
- Notification API requires permission; the template requests permission on first user interaction.
- The beep is implemented with WebAudio to avoid external assets.
- The template's script is intentionally simple; the more complete multi-timer logic lives under `stopwatch-AF/`.

If you want, I can also:
- Tweak the visuals (fonts, exact sizes) to be pixel-perfect with the reference image.
- Add persistence for the template countdown between page reloads.
- Add unit tests for the timer logic.
