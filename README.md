# Anna IA · Programación con Frameworks para Web

Proyecto de Guido Riaño, Ronaldo Rodriguez y Zharick Castro para COM30, Entrega 2. El catálogo de fichas de estudio reúne actividades para el aula. Se puede buscar por título o materia, abrir una actividad por identificador y agregar una ficha. Los registros viven en memoria durante la sesión de la SPA. Recargar el navegador restablece las tres fichas iniciales.

## Ejecutar la entrega

Desde la raíz, con Node.js 24 y npm:

```sh
npm ci
npm start
```

Abrir http://localhost:4200. El catálogo funciona con sus datos locales. Para compilar producción usar `npx ng build`; para ejecutar las pruebas, `npm test -- --watch=false`. La compilación se escribe en `dist/frontend/browser`. Al servirla con otro servidor estático, configurar el retorno a `index.html` en las rutas de la SPA.

## Rutas

| Ruta | Vista o destino | Parámetro |
| --- | --- | --- |
| `/` | Redirección al listado | — |
| `/listado` | Catálogo y búsqueda por título o materia | — |
| `/detalle/:id` | Actividad, materia y duración. Un identificador desconocido muestra «Ficha no encontrada». | `id`, recibido por `input.required<string>()` |
| `/alta` | Alta de una ficha | — |
| `/ingreso` | Ingreso al aula | — |
| `/inicio` | Inicio del aula | — |
| `/biblioteca` | Materias | — |
| `/anna` | Chat educativo | `q` opcional en la consulta |
| `/consultas` | Consultas del usuario | — |
| `/configuracion` | Preferencias | — |
| `/ayuda` | Ayuda del aula | — |
| `/docente` | Panel del docente | Requiere rol docente |
| `**` | Página 404 con regreso al catálogo | — |

La navegación del catálogo usa `routerLinkActive`. Angular carga las vistas de listado, detalle, alta y 404 con `loadComponent`. El catálogo es de acceso directo. El aula conserva el ingreso local de la aplicación base.

## Por qué el alta usa un formulario reactivo

La duración empieza vacía y al guardar debe convertirse en los minutos de una ficha identificada por el servicio. Un formulario reactivo con `FormBuilder` tipado permite declarar esa diferencia de tipos, evaluar juntos los cuatro controles y verificar las reglas sin simular eventos de la plantilla. En un formulario basado en plantillas, la declaración de estas reglas se repartiría entre directivas en el HTML y la lógica que consulta los títulos existentes.

El título admite de 4 a 80 caracteres y debe ser único aunque cambien las mayúsculas o las tildes. La duración admite enteros de 5 a 120 minutos y la actividad, de 15 a 800 caracteres. Todos los campos son obligatorios. Se usan `required`, `minLength`, `maxLength`, `min`, `max` y `pattern`, además del validador propio `tituloDisponible`. Cada mensaje aparece al tocar o modificar su campo. El botón permanece deshabilitado mientras el formulario sea inválido.

Al guardar, el componente convierte el valor del formulario, llama a `FichasService.agregar`, reinicia los controles y navega al listado. El servicio conserva la única señal que se puede modificar. El filtro combina `valueChanges`, normalización, `debounceTime(300)` y `distinctUntilChanged()`; `toSignal` libera la suscripción al destruir la vista.

## Organización

- `src/app/fichas/` reúne el servicio, el formulario y las vistas evaluadas.
- `src/app/core/`, `paginas/`, `layout/` y `shared/` contienen el aula de Anna IA.
- `public/` contiene imágenes locales. `backend/` conserva el servidor opcional del chat.
- Para el chat, instalar las dependencias en `backend/` con `npm ci` y ejecutar `npm start` allí. El proxy de desarrollo usa el puerto 3000 local o el destino indicado en `ANNA_SERVIDOR`. El servidor utiliza Ollama y Kiwix según la configuración de `backend/server.js`. Las actividades del catálogo funcionan independientemente de esos servicios.

La rama de entrega es `master`. Este repositorio conserva el historial del proyecto base y separa el trabajo de COM30. La participación específica en esta entrega se identifica con los commits posteriores a `d9a2ec8`.
