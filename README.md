# LifeOS

Asistente personal para el colegio y el día a día. Pensado para usarse desde el iPhone, instalado en la pantalla de inicio.

Organiza horario, materias, tareas, exámenes, calendario, rutinas, hábitos, estudio, pendientes, notas y una preparación de mañana. Los números de estadísticas salen de lo que registrás. No hay datos inventados en esas cuentas.

## Tecnología

- React y TanStack Start.
- Tailwind.
- IndexedDB en el teléfono para tareas, horario, hábitos y el resto.
- Manifiesto web para abrirse sin la barra de Safari.
- Service worker de la app publicada: red primero, y una copia del cascarón si no hay conexión. Tus registros no van a esa caché.
- Sin cuenta obligatoria y sin base en la nube. Una copia JSON sirve de respaldo.

No usa GitHub Pages. Esa plataforma no tiene base de datos ni un servidor de notificaciones, y esta app se publica por HTTPS como aplicación, no como sitio estático suelto.

## Datos

Todo queda en este dispositivo. Si borrás los datos del sitio, se pierden. En Ajustes podés exportar o importar un archivo `lifeos-fecha.json`.

No hay sincronización entre teléfonos. No hace falta: una cuenta pública mezclaría datos personales de colegio. Si más adelante querés nube, el camino es un proyecto propio (por ejemplo Supabase) con sesión y políticas por usuario, y las claves privadas fuera del repositorio.

## Avisos

Hay tres cosas distintas:

1. **Aviso con la app abierta.** LifeOS revisa fechas mientras está en pantalla y muestra un cartel. Esto sí está implementado.
2. **Aviso local del navegador.** Si tocás «Activar notificaciones» y el sistema lo permite, también puede mostrar una notificación del sistema. En el iPhone, iOS 16.4 o posterior solo lo ofrece si agregaste la app a inicio y la abrís desde el ícono. El permiso se pide recién cuando tocás el botón.
3. **Push de un servidor, con la pantalla bloqueada.** No está conectado. Hace falta un backend con claves VAPID privadas, suscripciones guardadas por dispositivo y un programador. Esas claves no pueden vivir en el código. No simules que ya llega.

Completar, borrar o cambiar la fecha de una tarea evita repetir el aviso pendiente. Un aviso ya mostrado no se “borra” del centro de notificaciones.

Una rutina no es una alarma de Reloj. Si necesitás que suene sí o sí con el teléfono bloqueado, usá la app Reloj además de LifeOS.

## Instalar en el iPhone

1. Abrí la dirección HTTPS en Safari.
2. Tocá Compartir.
3. Tocá Agregar a inicio.
4. Abrí LifeOS desde el ícono nuevo.

Desde una pestaña de Safari sigue siendo usable, pero no es el modo aplicación y los avisos web del iPhone no se habilitan.

## Actualizar

Cuando haya una versión nueva, LifeOS muestra un botón para aplicarla. No hace falta borrar el ícono. El service worker pide la red antes que la copia vieja, para no quedar atrapado en una versión anterior.

## Mantener el proyecto

El código está organizado así:

- `src/routes` arranque de la app.
- `src/components/life` pantallas.
- `src/lib/life` datos, IndexedDB, prioridades, calendario y avisos.
- `public/lifeos-sw.js` caché del cascarón, solo en la app publicada.
- `src/styles.css` colores y tipo.

El horario habitual y un cambio de un solo día conviven: el cambio no pisa la semana siguiente. Un evento repetido se puede editar ese día o toda la serie.

## Límites conocidos

- Sin servidor de push, no hay recordatorio con la app cerrada.
- El service worker no se registra en la vista previa de desarrollo, para no pelearse con la recarga en vivo. La copia sin conexión corresponde a la app publicada.
- Los adjuntos de una tarea tienen un tope de 280 KB y se guardan en el teléfono.
- La propuesta de “Organizar mi semana” solo usa tardes libres de 16:00 a 20:30 y no toca el calendario hasta que confirmás cada sesión.
- Safari puede borrar datos de una PWA si el sistema libera espacio. Por eso existe la exportación.
