# iD.stone — SIGNAL 03

Web de producto con portada escultórica, infraestructura de lectura automática, escenario continuo, DPP y catálogo BIM conceptual. Evolución de SIGNAL 02; Continuum 05 permanece separado.

## Abrir y subir a GitHub

Abre `index.html` o ejecuta `node server.mjs` para probar en HTTP local. Sube los archivos y carpetas del interior de este ZIP al repositorio. No requiere instalación, claves o conectores. No se ha publicado ni creado un repositorio remoto.

La entrega HTML autocontenida se abre directamente e incluye imágenes y PDFs. Para GitHub utiliza el contenido del ZIP: todos sus archivos están por debajo de 25 MB.

- `index.html`: web completa.
- `recorrido.html`: recorrido independiente.
- `atlas.html`: mesa operativa de demostración.
- `docs/ID_Stone_Dossier_Producto_15p.pdf`: dossier actualizado, 15 páginas, aproximadamente 16,3 MB.
- `docs/ID_Stone_Beneficios_Proceso.pdf`: lámina de beneficios.
- `signal.*`: presentación, simulación del puesto y selector de operaciones.
- `journey.*`: recorrido y funciones operativas compartidas.
- `evolution.*`: beneficios, vista BIM y eventos de unidades.

## Recorrido continuo

Las imágenes de cantera, fábrica y arquitectura permanecen en coordenadas fijas dentro de un escenario de 4.100 × 1.450 unidades. La cámara cambia de posición y encuadre mediante una curva continua; no sustituye imágenes ni usa fundidos entre escenas. La línea representa relaciones conceptuales, no una carretera ni cobertura de radio.

Scroll nativo con amortiguación dependiente del tiempo, selección de etapas, barra accesible, reproducción circular de 110 segundos, pausa y modo cine. La vista general inicial y final coincide para cerrar el bucle. Al pausar se alinea la posición visual con el scroll. Fuera de vista se detiene la animación. Con movimiento reducido se mantiene la vista general y cambia la información de etapa.

Es una composición 2.5D, no vídeo ni un modelo 3D navegable. Las prestaciones dependen del dispositivo y navegador.

## DPP y BIM

El DPP diferencia el tipo de producto de las unidades físicas y sus eventos. Incluye identidad, documentos, permisos, versiones e interoperabilidad como estructura propuesta.

Fuente normativa: Reglamento (UE) 2024/3110, artículos 22.7 y 75–80:
https://eur-lex.europa.eu/eli/reg/2024/3110/oj?locale=es

La obligación del fabricante se aplica 18 meses después de la entrada en vigor del acto delegado que establece el sistema; comprobar producto, transitorios y actos aplicables. No se afirma una fecha universal para toda la piedra ni una certificación automática.

El catálogo muestra cuatro familias conceptuales y permite consultar sus parámetros propuestos o los eventos simulados de una unidad. No entrega RFA/IFC ni familias paramétricas de producción. Los formatos, conectores, geometría, prestaciones y documentos requieren desarrollo y validación según proyecto. Los diseños escultóricos tampoco son detalles de cálculo o fabricación.

## Funciones y límites

Conserva beneficios por etapa, áreas de operación, stock/albaranes, evidencias ISO/UNE, personas/EPIs, registro offline local y conciliación explícita simulada. El puesto de lectura es una simulación: no hay backend ni hardware conectado. Las ampliaciones mantienen su estado de propuesta o validación.

En HTTP local/HTTPS, la web puede recargarse sin red tras completar su primera carga y cacheado. Los PDFs no se precargan en el service worker. La entrega HTML autocontenida incluye los PDF para descargarlos localmente.

## Dossier

Se mantienen 15 páginas. Actualizadas 04 (elementos de diseño), 05 (DPP) y 14 (catálogo BIM e implantación). Las demás páginas se conservan. Las referencias de campo no se presentan como rendimientos demostrados en piedra.
