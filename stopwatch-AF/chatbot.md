# chatbot.md

1) ¿Qué chatbot(s) usaste?

- Usé un modelo de chat (asistente) para generar el código y los archivos. El flujo incluyó preguntas iterativas y refinamientos.

2) ¿Qué problemas encontraste al interactuar con el modelo?

- Tendencia a saltarse validaciones o no tratar casos de ausencia de APIs (por ejemplo, Notification). Requirió indicar explícitamente el manejo de permisos y fallbacks.
- A veces generó nombres de archivos distintos a los solicitados; hubo que especificar la estructura exacta.

3) ¿Qué decisiones tuviste que tomar tú como desarrollador para mejorar el código propuesto?

- Elegir una estrategia de persistencia simple (localStorage) en vez de proponer backends.
- Implementar WebAudio en lugar de archivos de audio externos para evitar gestión de assets.
- Mantener todo en vanilla JS y CSS, sin frameworks, para cumplir con la entrega simple.

4) ¿Qué tipo de intervenciones manuales realizaste como desarrollador para mejorar la eficiencia del proceso?

- Añadí validaciones (duración mínima), manejo de permiso de notificaciones y fallback UI.
- Refiné la estructura de datos de timers y la renderización para manejar simultaneidad.
- Añadí persistencia y restauración al cargar la página.

5) ¿Cómo evaluarías la utilidad de este flujo de trabajo real?

- Muy útil para prototipado rápido. El chatbot acelera la generación de boilerplate y lógica repetitiva. Requiere supervisión del desarrollador para validaciones, UX y compatibilidad. En conjunto, reduce tiempo de desarrollo y permite iteraciones rápidas.
