const fs = require('fs');
const cheerio = require('cheerio');
const Entities = require('html-entities').XmlEntities;
const ACCESS = require('./access');
const Log = require('./logging.helper').Log;

// PRIVATE
const isDecimal = value => /^\d+\.\d+$/g.test(value.toString());
const entities = new Entities();
const addDecimal = (number) => {
    if (number === '') return '0.0';
    const isDec = isDecimal(number) 
    const result = isDec ? number : number + '.0';
    if (!isDec)
        Log.info(`Non decimal found ${number} converting to value with decimal: ${result}`);
    return result;
}
const sanitizeJSON = value => entities.encode(value);

const cleanUpSpacing = value => value.replace(/\r?\n|\r/g, ' ').replace(/\s\s+/g, ' ');

const getBeers = ($) => $('table');

const getBeerRows = ($, beer) => $(beer).find('tbody tr');

const get = ($, rows, access) => {
    const value = sanitizeJSON(cleanUpSpacing($($(rows).find('td')[access]).text()));
    switch(access) {
        case ACCESS.precio:
        case ACCESS.alcohol:
            return addDecimal(value);
        case ACCESS.ibu:
        case ACCESS.favorita:
            return value ? 1 : 0;
        default:
            return (value);
    }
}

const getNota = ($, rows, access) => {
    const data = $($(rows).find('td')[access]).find('span').first().contents().first().html();
    const value = data ? (data.split('&').length ? (data.split('&').length - 1) : 1) : 0;
    switch(access) {
        case ACCESS.calificacion:
            return addDecimal(value);
        default:
            return value;
    }
}

const load = path => {
    try {
        return fs.readFileSync(path, 'utf8');
    } catch(err) {
        Log.error(err);
        return null;
    }
};

const parseHtml = (data) => cheerio.load(data);

// PUBLIC

const Html = path => {
    const data = load(path);
    if (!data) return null;
 
    const $ = parseHtml(data);
    
    return {
        getBeers: () => getBeers($),
        get: (beer, access) => get($, getBeerRows($, beer), access),
        getNote: (beer, access) => getNota($, getBeerRows($, beer), access),
    }
};

module.exports = {
    Html,
}