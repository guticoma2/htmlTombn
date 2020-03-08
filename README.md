# htmlTonbm

Es una utilidad para convertir (en el caso que la exportación a MBN falle) los ficheros HTML exportados de My Beer Notes a un fichero importable MBN (xml).


## Instalación:

- Ir a https://nodejs.org/es/download/ para descargar Node (seleccione LTS)
- Ejecute el instalador siguiendo las instrucciones
- Abra la consola de comandos (en Windows escriba ``` cmd ``` en el buscador e INTRO)
- Escriba ``` npm i @guticoma/html-to-mbn ``` y presione INTRO

## Uso

### Básico
``` node htmlTombn.js --html [nombre_fichero_html] ```
### Creación de lotes (por si el fichero generado es demasiado grande y da problemas al importar)
``` node htmlTombn.js --html [nombre_fichero_html] --chunks [tamaño] ```
### Si se requiere tener un informe completo de la conversión:
``` node htmlTombn.js --html [nombre_fichero_html] --verbose [otros_parámetros_opcionales] ```
### Si se quire especificar el formato del fichero de salida:
``` node htmltoMbn.js --html [nombre_fichero_html] --format .xml [otros_parámetros_opcionales ```

_Valores válidos: ```.xml``` o ```.mbn```_