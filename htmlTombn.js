const fs = require('fs');
const ACCESS = require('./access');
const Xml = require('./xml.helper').Xml;
const Log = require('./logging.helper').Log;
const Html = require('./html.helper').Html;

const argv = require('yargs').usage('Usage: node $0 --html=[pathToHtmlFile] --output=[pathToSaveMBN] --chunk=[chunkSize] --format=[.mbn|.xml] --verbose')
.demandOption(['html'])
.describe('html', 'Carpeta donde se encuentra el fichero HTML exportado.')
.describe('output', 'Carpeta donde se guardará el fichero MBN generado. Por defecto el mismo directorio de la app.')
.describe('verbose', 'Muestra log de todos los pasos que va realizando la app.')
.describe('chunk', 'Se generarán ficheros de como máximo el tamaño de catas especificados hasta llegar al final.')
.describe('format', 'Especifica la extensión con la que genererá el fichero de salida . Hay 2 valores validos: .xml o .mbn. Por defecto .mbn')
.check(yargs => {
    if (yargs.format !== undefined && yargs.format !== Xml.formats.MBN && yargs.format !== Xml.formats.XML)
        throw Error('invalid format value.');
    if (yargs.output !== undefined && !fs.existsSync(yargs.output))
        throw Error('invalid output path.');
    if (yargs.html !== undefined && !fs.existsSync(yargs.html))
        throw Error('can`t find html file on the location specified');
    if (yargs.chunks !== undefined && (!Number.isInteger(yargs.chunk) || yargs.chunk < 1)) {
        throw Error('inlivad chunk number.');
    }
    return true;
})
.argv;


const main = () => {

    const exportCata = (beer, i, xml) => {
        let hasErrors = false;
        Log.info(`Creating Cata number ${i}`);
        xml.openCata();
        let logValueExtracted = '';
    
        for (const key in ACCESS) {
            try {
                const access = ACCESS[key];
                let value = '';
                if (key.startsWith('nota') || access === ACCESS.calificacion) {
                    value = this.html.getNote(beer, access)
                    xml.add(value, access);
                } else {
                    value = this.html.get(beer, access)
                    xml.add(value, access);
                }
                logValueExtracted += `{ KEY: ${key}, VALUE: ${value} }`;
            } catch(err) {
                const error = `error in register ${i} and key ${key} : ${err}`;
                Log.error(error);
                hasErrors = true;
            }
        }
        writePcToConsole(getPcDone(this.globalNdx++, this.total));
        Log.info(logValueExtracted);
        Log.info('Closing processed cata');
        xml.closeCata();
        return !hasErrors;
    };

    const exportBatch = (beers, i) => {
        
        Log.info('Creating new XML');
        let globalNdx = 0;
        let xml = Xml();
        let hasErrors = false;
        for (let i = 0, l = beers.length; i < l; i++) {
            const beer = beers[i];
            if (!exportCata(beer, i, xml)) hasErrors = true;
        };
        Log.info('Closing XML');
        xml.close();
        Log.info(`Writing exported MBN to: ${this.pathOutput}`);
        if (!xml.writeToDisk(this.pathOutput, i, this.format)) hasErrors = true;
        return !hasErrors;
    };

    const createChunks = (beers, chunk) => {
        const chunks = [];
        if (chunk > beers.length) chunk = beer.length;
        for (let i = 0, l = beers.length, chunkCount = 0; i < l; i += chunk) {
            chunks[chunkCount++] = beers.slice(i, i + chunk);
        }
        return chunks;
    };

    const getPcDone = (i, total) => {
        const pc = parseInt((i / total) * 100, 10);
        return  pc > 0 ? pc - 1 : pc;
    };

    const writePcToConsole = pc => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(`Processing ${pc}%...`);
    };

    try {
        const pathHtml = argv.html;
        const verbose = argv.verbose;
        this.pathOutput = argv.output || './';
        this.format = argv.format;
        this.globalNdx = 0;

        Log.setVerbose(verbose);
        Log.info(`parssing HTML file: ${pathHtml}`);
        this.html = Html(pathHtml);
        Log.info('Get beers from HTML');
        const beers = this.html.getBeers();
       
        const chunk = argv.chunk || beers.length;
        const chunks = createChunks(beers, chunk);
        let hasErrors = false;

        this.total = beers.length;

        for (let i = 0, l = chunks.length; i < l; i++) {
            if(!exportBatch(chunks[i], i)) hasErrors = true;
        }
      
        if (hasErrors) Log.warning('Some errors ocurred. Check your .log file in the current directory.');
        else {
            writePcToConsole(100);
            Log.success(`HTML exported to MBN successfully to: ${this.pathOutput}`);
        }
    } catch(err) {
        Log.error(`Can not process this file. ${err}`);
    }
}
   
main();

