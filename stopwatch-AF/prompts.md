# prompts.md

## Prompt inicial con justificación

- Objetivo: Generar una aplicación web que permita crear múltiples cronómetros y cuentas regresivas, con notificación y sonido al finalizar.
- Estrategia: Usé un prompt paso a paso con restricciones claras y formatos de salida (archivos a crear). Especificé: características obligatorias, UX mínimo, APIs a usar (Notification API, WebAudio), y preservar compatibilidad sin dependencias externas.
- Justificación: Dar estructura reduce ambigüedad; incluir detalles técnicos (por ejemplo, formato HH:MM:SS para duración) evita malentendidos en la implementación.

Prompt inicial (resumen):
"Crea una carpeta con una app web estática que implemente múltiples cronómetros y cuentas regresivas. Debe incluir index.html, styles.css, script.js, prompts.md y chatbot.md. Requisitos: usar Notification API para notificaciones, WebAudio para alerta sonora; permitir crear, iniciar/pausar, resetear y eliminar timers; formato de duración HH:MM:SS; persistencia en localStorage; UI clara y responsive. Entregar archivos listos para PR."

## Resultados parciales con errores o fallos detectados

- Primera versión no validaba duración o permitía duraciones negativas.
- Necesidad de pedir permisos para notificaciones y manejar navegadores sin soporte.
- UI inicial no mostraba estado 'finalizado' de forma clara.

## Refinamientos aplicados

- Añadí validación básica de duración (>=1s) y mensajes de alerta.
- Implementé Notification.requestPermission desde un botón y manejo de ausencia de soporte.
- Añadí bandera `alarmed` para marcar timers terminados y cambiar estilo.
- Implementé un simple beep con WebAudio para sonar en todas plataformas modernas.

## Prompt final

"Genera una app web estática en carpeta `stopwatch-AF` con `index.html`, `styles.css`, `script.js`, `prompts.md` y `chatbot.md`. Requisitos exactos: múltiples timers (cronómetro o countdown), interfaz para crear (tipo, etiqueta, duración HH:MM:SS), botones iniciar/pausa/reset/eliminar por timer, persistencia en localStorage, notificaciones al finalizar (Notification API) y sonido (WebAudio). La UI debe ser simple y responsive. Incluye manejo de permisos de notificación y fallback si no soportado. Entrega archivos listos para PR."

Breve explicación de por qué funcionó: El prompt final es específico, limita el alcance y establece APIs concretas, lo que permite al modelo generar código coherente y completo sin requerir iteraciones largas.
