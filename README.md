# htmlTonbm

Es una utilidad para convertir (en el caso que la exportación a NBM falle) los ficheros HTML exportados de My Beer Notes a un fichero importable MBN (xml).


## Instalación:

- Ir a https://nodejs.org/es/download/ para descargar Node (seleccione LTS)
- Ejecute el instalador siguiendo las instrucciones
- Abra la consola de comandos (en Windows escriba ``` cmd ``` en el buscador e INTRO)
- Escriba ``` npm i htmlTonbm ``` y presione INTRO

## Uso

### Básico
``` node htmlTombn.js --html [nombre_fichero_html] ```
### Creación de lotes (por si el fichero generado es demasiado grande y da problemas al importar)
``` node htmlTombn.js --html [nombre_fichero_html] --chunks [tamaño] ```
### Si se requiere tener un informe completo de la conversión:

``` node htmlTombn.js --html [nombre_fichero_html] --verbose [otros_parámetros_opcionales] ```