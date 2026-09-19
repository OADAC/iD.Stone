# iD.stone · Material Experience / Edición 02

Prototipo de producto en español. HTML, CSS y JavaScript sin dependencias, compilación, claves API ni servicios externos.

## Abrir

La forma más sencilla: descomprimir y abrir `index.html` en un navegador. El pasaporte, la arquitectura, los módulos de operación y el dossier funcionan con archivos locales.

Para probar también la recarga sin red mediante el service worker, con Node.js instalado:

```sh
node server.mjs
```

Abrir `http://localhost:8080`. La aplicación solo se sirve en el equipo local. Para cerrar: Ctrl+C.

## Subir al repositorio

Subir el CONTENIDO de esta carpeta a la raíz del repositorio:

- `index.html`
- `art.css` y `art.js` (nueva dirección artística e interacciones)
- `styles.css`
- `app.js`
- `sw.js`
- `assets/` completo
- `docs/ID_Stone_Dossier_Producto_15p.pdf`
- `server.mjs`, `README.md`, `ASSETS.md` y `.nojekyll`

No hace falta ejecutar `npm install` ni generar una carpeta de compilación. Las rutas son relativas: sirven también bajo una subcarpeta de repositorio.

El botón «Descargar dossier» apunta a `docs/ID_Stone_Dossier_Producto_15p.pdf`. Se incluye la edición 04, de 15 páginas. Para actualizarla, sustituir ese archivo conservando el nombre; revisar edición, tamaño y páginas en `index.html` si cambian.

No se ha creado ningún repositorio ni desplegado la web. Subir archivos a un repositorio no es lo mismo que publicarlos como una web. Mantener el repositorio privado mientras se revisa el prototipo. No se incluye despliegue automático.

## Qué funciona

- Tres capas seleccionables en la portada: materia, identidad y memoria.
- Galería de producto con asiento Arco y lavabo Monolito, fichas de identidad y nuevos assets.
- Portada escultórica con movimiento sutil, anillos de datos y tipografía editorial.
- Pasaporte con cinco etapas, genealogía y ficha ampliada.
- Selección de tres elementos arquitectónicos con su historial.
- Captura de eventos de recepción, revisión e incidencia.
- Modo offline elegido y detección de la desconexión real.
- Cola persistente en el navegador y conciliación manual simulada.
- Conteo de unidades recibidas únicas, sin duplicar stock por repetir recepción o sincronización.
- CSV descargable de los eventos.
- Borrador HTML descargable del albarán desde recepciones conciliadas.
- Autocompletado de cuatro campos documentales desde eventos aceptados de ST-0248-A.
- Asignación/devolución simulada de EPI.
- Descarga del dossier PDF incluido.
- Diseño adaptable, teclado, foco visible, ventanas accesibles y respeto de movimiento reducido.

## Prueba del modo offline

1. Abrir con servidor local o HTTPS y esperar a que termine la primera carga.
2. En Laboratorio, pulsar «Probar sin conexión».
3. Registrar un evento. Queda pendiente, guardado en este dispositivo.
4. Recargar: el evento y el modo elegido permanecen.
5. Pulsar «Volver a online». La cola no se vacía sola.
6. Pulsar «Sincronizar ahora». Se concilia una vez dentro de la simulación.
7. Registrar y conciliar de nuevo la misma unidad: el contador de unidades recibidas sigue contando una sola unidad.

También se puede poner la red en Offline desde las herramientas del navegador y recargar tras la primera carga completa. El service worker conserva la web y sus imágenes. El PDF no se precarga: debe descargarse aparte. Con `file://`, el service worker no está disponible, pero el sitio puede abrirse desde sus archivos locales.

## Alcance y datos

Esta es una demostración de front-end. No se conecta a CUEVA, ERP, lectores RFID, bases de datos ni servicios de identidad. «Conciliar» simula una aceptación local, no confirma una recepción real ni resuelve conflictos entre centros reales. Los datos de ejemplo se conservan en `localStorage` bajo `idstone-explorer-v1`. El botón Reiniciar demo borra solo esos datos.

No introducir datos sensibles en este prototipo. La separación de roles, autenticación, cifrado local, sincronización remota con idempotencia, resolución de conflictos, documentos de negocio y revisión técnica deben implementarse en el producto conectado.

Las evidencias ISO/UNE ilustran preparación documental, no certificación. La asignación de un EPI no acredita uso correcto o habilitación. Las imágenes y los historiales son conceptuales, no implantaciones reales.

## Estructura y edición

- `index.html`: narrativa, secciones, campos y descarga del dossier.
- `styles.css`: colores, tipografía, composición, responsive y movimiento.
- `app.js`: estado local, pasaporte, elementos, eventos y exportaciones.
- `sw.js`: precarga de la aplicación. Incrementar `CACHE` al publicar una revisión para renovar archivos sin conexión.
- `assets/`: imágenes WebP locales; no hay solicitudes a CDNs, fuentes remotas ni analítica.
- `docs/`: presentación PDF.

Conserva las advertencias de demostración al enseñar capacidades simuladas. El PDF incluido conserva sus propias notas de alcance y revisión.
