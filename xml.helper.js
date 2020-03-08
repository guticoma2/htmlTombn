const fs = require('fs');
const path = require('path');
const xmlFormatter = require('xml-formatter');
const ACCESS = require('./access');
const Log = require('./logging.helper').Log;

// PRIVATE 

const createXmlRoot = () => '<catasmbn>';
const closeXmlRoot = xml => (xml + '</catasmbn>');
const createXmlCata = xml => (xml + '<cata>');
const closeXmlCata = xml => (xml + '</cata>');
const addXml = (xml, value, access) => {
    switch(access) {
        case ACCESS.nombre:
            return (xml + '<nombre>' + value + '</nombre>')
        case ACCESS.cervecera:
            return (xml + '<cervecera>' + value + '</cervecera>');
        case ACCESS.estilo:
            return (xml + '<estilo>' + value + '</estilo>');
        case ACCESS.servicio:
            return (xml + '<servicio>' + value + '</servicio>');
        case ACCESS.precio:
            return (xml + '<precio>' + value + '</precio>');
        case ACCESS.cantidad:
            return (xml + '<cantidad>' + value + '</cantidad>');
        case ACCESS.alcohol:
            return (xml + '<alcohol>' + value + '</alcohol>');
        case ACCESS.ibu:
            return (xml + '<ibu>' + value + '</ibu>');
        case ACCESS.color:
            return (xml + '<color>' + value + '</color>');
        case ACCESS.espuma:
            return (xml + '<espuma>' + value + '</espuma>');
        case ACCESS.vaso:
            return (xml + '<vaso>' + value + '</vaso>');
        case ACCESS.lugar:
            return (xml + '<lugar>' + value + '</lugar>');
        case ACCESS.pais:
            return (xml + '<pais>' + value + '</pais>');
        case ACCESS.fechacata:
            return (xml + '<fechacata>' + value + '</fechacata>');
        case ACCESS.favorita:
            return (xml + '<favorita>' + value + '</favorita>');
        case ACCESS.notaaroma:
            return (xml + '<notaaroma>' + value + '</notaaroma>');
        case ACCESS.notaamargor:
            return (xml + '<notaamargor>' + value + '</notaamargor>');
        case ACCESS.notapresencia: 
            return (xml + '<notapresencia>' + value + '</notapresencia>');
        case ACCESS.notasabor:
            return (xml + '<notasabor>' + value + '</notasabor>');
        case ACCESS.descripcion:
            return (xml + '<notas>' + value + '</notas>');
        case ACCESS.calificacion:
            return (xml + '<calificacion>' + value + '</calificacion>');

        default:
            throw Error(`ACCESS key ${access} do not exist.`);

    }
}

const formats = {
    MBN: '.mbn',
    XML: '.xml',
}

const defaultXmlPath = './';

const writeToDisk = (xmlPath = defaultXmlPath, i, xml, format = formats.MBN) => {
    const xmlPathFile = path.join(xmlPath, `result.${i}${format}`);
    try {
        fs.writeFileSync(xmlPathFile,
            format === formats.XML ? xmlFormatter(xml, { collapseContent: true }) : xml);
        Log.info(`XML file ${xmlPathFile} generated.`);
        return true;
    } catch(err) {
        Log.error(err);
        return false;
    };
}

// PUBLIC

const Xml = () => {
    let xml = createXmlRoot();
    return {
        add: (value, access) => { xml = addXml(xml, value, access) },
        openCata: () => { xml = createXmlCata(xml) },
        closeCata: () => { xml = closeXmlCata(xml) },
        close: () => { xml = closeXmlRoot(xml) },
        writeToDisk: (opath, i, format) => writeToDisk(opath, i, xml, format), 
    }
};

Xml.formats = formats;

module.exports = {
    Xml,
};