const argv = require('yargs').usage('Usage: node $0 --html=[pathToHtmlFile] --output=[pathToSaveMBN] --chunk=[chunkSize] --verbose')
// .demandOption(['html'])
.describe('html', 'Carpeta donde se encuentra el fichero HTML exportado.')
.describe('output', 'Carpeta donde se guardará el fichero MBN generado. Por defecto el mismo directorio de la app.')
.describe('verbose', 'Muestra log de todos los pasos que va realizando la app.')
.describe('chunk', 'Se generarán ficheros de como máximo el tamaño de catas expeficidos hasta llegar al final.')
.argv;

const ACCESS = require('./access');
const Xml = require('./xml.helper').Xml;
const Log = require('./logging.helper').Log;
const Html = require('./html.helper').Html;

const exportCata = (beer, i, html, xml) => {
    let hasErrors = false;
    Log.info(`Creating Cata number ${i}`);
    xml.openCata();
    let logValueExtracted = '';
   
    for (const key in ACCESS) {
        try {
            const access = ACCESS[key];
            let value = '';
            if (key.startsWith('nota') || access === ACCESS.calificacion) {
                value = html.getNote(beer, access)
                xml.add(value, access);
            } else {
                value = html.get(beer, access)
                xml.add(value, access);
            }
            logValueExtracted += `{ KEY: ${key}, VALUE: ${value} }`;
        } catch(err) {
            const error = `error in register ${i} and key ${key} : ${err}`;
            Log.error(error);
            hasErrors = true;
        }
       
    }
    Log.info(logValueExtracted);
    Log.info('Closing processed cata');
    xml.closeCata();
    return !hasErrors;
};

const exportBatch = (beers, html, i, pathOutput) => {
    
    Log.info('Creating new XML');
    let xml = Xml();
    let hasErrors = false;
    for (let i = 0, l = beers.length; i < l; i++) {
        const beer = beers[i];
        if (!exportCata(beer, i, html, xml)) hasErrors = true;
    };
    Log.info('Closing XML');
    xml.close();
    Log.info(`Writing exported MBN to: ${pathOutput}`);
    xml.writeToDisk(pathOutput, i);
    return !hasErrors;
};

const createChunks = (beers, chunk) => {
    const chunks = [];
    for (let i = 0, l = beers.length, chunkCount = 0; i < l; i += chunk) {
        chunks[chunkCount++] = beers.slice(i, i + chunk);
    }
    return chunks;
};

const main = () => {
    try {
        const pathHtml = argv.html;
        const verbose = argv.verbose;
        const pathOutput = argv.output || './';

        Log.setVerbose(verbose);
        Log.info(`parssing HTML file: ${pathHtml}`);
        const html = Html(pathHtml);
        Log.info('Get beers from HTML');
        const beers = html.getBeers();
        const chunk = argv.chunk || beers.length;
        const chunks = createChunks(beers, chunk);
        let hasErrors = false;

        for (let i = 0, l = chunks.length; i < l; i++) {
            if(!exportBatch(chunks[i], html, i, pathOutput)) hasErrors = true;
        }
      
        if (hasErrors) Log.warning('Some errors ocurred. Check your .log file in the current directory.');
        else Log.success(`HTML exported to MBN successfully to: ${pathOutput}`);
    } catch(err) {
        Log.error(`Can not process this file. ${err}`);
    }
}
   
main();

