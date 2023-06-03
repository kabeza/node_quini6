import * as cheerio from 'cheerio';

const axios = require('axios').default;

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

const searchJSON = (obj, key, val) => {
  let results = [];
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      if (k === key && obj[k] === val) {
        results.push(obj);
      } else if (typeof obj[k] === "object") {
        results = results.concat(searchJSON(obj[k], key, val));
      }
    }
  }
  return results;
};

const obtenerListaSorteos = async () => {
  const url2Get = 'https://www.tujugada.com.ar/quini6.asp';
  try {
    const response = await axios.get(url2Get);
    const $ = cheerio.load(response.data);
    const resp = [];
    $('div.ante').each((i, el) => {
      resp[i] = {
        sorteo: {
          numero: $(el).text().trim().substring(15, 19),
          titulo: insert($(el).text().trim(), 19, ' '),
          fecha: $(el).text().trim()
            .slice($(el).text().trim().indexOf(':') + 1)
            .trim(),
          link: `https://www.tujugada.com.ar/quini6.asp?sorteo=${$(el).text().trim().substring(15, 19)}`
        }
      };
    });
    return resp;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return false;
  }
};

export async function tuJugadaSorteos(req, res) {
  try {
    // const datos = await obtenerListaSorteos();
    const datos = await obtenerListaSorteos();
    return res.status(200).json({
      status: 200,
      message: 'Sorteos obtenidos exitosamente',
      cantidad: datos.length,
      data: datos
    });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
}

const obtenerResultadosSorteo = async (sorteoNro) => {
  const listaSorteos = await obtenerListaSorteos();
  const resBusca = searchJSON(listaSorteos, 'numero', sorteoNro);
  const url2Get = resBusca[0].link;
  const retorno = {
    infoSorteo: resBusca,
    resultados: []
  };
  try {
    const response = await axios.get(url2Get);
    const $ = cheerio.load(response.data);

    const numeros = [];

    // 1 SORTEO TRADICIONAL
    numeros.splice(0, numeros.length);
    $('table.tit:contains("TRADICIONAL")').first()
      .next().next()
      .find('table')
      .find('td')
      .each((i, el) => {
        numeros.push((`0000${$(el).text().trim()}`).slice(-2));
      });

    retorno.resultados[0] = {
      titulo: 'SORTEO TRADICIONAL',
      numeros: numeros.toString(),
      premios: []
    };
    $('table.tit:contains("PREMIOS TRADICIONAL")').first().next('table')
      .find('tr')
      .each((i, el) => {
        if ($(el).text().trim().includes('Aciertos')) {
          return true;
        }
        const st = $(el).find('td').toArray();
        retorno.resultados[0].premios.push({
          aciertos: $(st[0]).text().trim().replace(' Nros.', ''),
          ganadores: $(st[1]).text().trim(),
          premio: $(st[2]).text().trim(),
        });
      });

    // 2 SEGUNDA VUELTA
    numeros.splice(0, numeros.length);
    $('table.tit:contains("SEGUNDA VUELTA")').first()
      .next().next()
      .find('table')
      .find('td')
      .each((i, el) => {
        numeros.push((`0000${$(el).text().trim()}`).slice(-2));
      });
    retorno.resultados[1] = {
      titulo: 'SEGUNDA VUELTA',
      numeros: numeros.toString(),
      premios: []
    };
    $('table.tit:contains("PREMIOS 2DA VUELTA")').first().next('table')
      .find('tr')
      .each((i, el) => {
        if ($(el).text().trim().includes('Aciertos')) {
          return true;
        }
        const st = $(el).find('td').toArray();
        retorno.resultados[1].premios.push({
          aciertos: $(st[0]).text().trim().replace(' Nros.', ''),
          ganadores: $(st[1]).text().trim(),
          premio: $(st[2]).text().trim(),
        });
      });

    // 3 REVANCHA
    numeros.splice(0, numeros.length);
    $('table.tit:contains("REVANCHA")').first()
      .next().next()
      .find('table')
      .find('td')
      .each((i, el) => {
        numeros.push((`0000${$(el).text().trim()}`).slice(-2));
      });
    retorno.resultados[2] = {
      titulo: 'REVANCHA',
      numeros: numeros.toString(),
      premios: []
    };
    $('table.tit:contains("PREMIOS REVANCHA")').first().next('table')
      .find('tr')
      .each((i, el) => {
        if ($(el).text().trim().includes('Aciertos')) {
          return true;
        }
        const st = $(el).find('td').toArray();
        retorno.resultados[2].premios.push({
          aciertos: $(st[0]).text().trim().replace(' Nros.', ''),
          ganadores: $(st[1]).text().trim(),
          premio: $(st[2]).text().trim(),
        });
      });

    // 3 SIEMPRE SALE
    numeros.splice(0, numeros.length);
    $('table.tit:contains("SIEMPRE SALE")').first()
      .next().next()
      .find('table')
      .find('td')
      .each((i, el) => {
        numeros.push((`0000${$(el).text().trim()}`).slice(-2));
      });
    retorno.resultados[3] = {
      titulo: 'SIEMPRE SALE',
      numeros: numeros.toString(),
      premios: []
    };
    $('table.tit:contains("PREMIOS SIEMPRE SALE")').first().next('table')
      .find('tr')
      .each((i, el) => {
        if ($(el).text().trim().includes('Aciertos')) {
          return true;
        }
        const st = $(el).find('td').toArray();
        retorno.resultados[3].premios.push({
          aciertos: $(st[0]).text().trim().replace(' Nros.', ''),
          ganadores: $(st[1]).text().trim(),
          premio: $(st[2]).text().trim(),
        });
      });

    // 4 POZO EXTRA
    numeros.splice(0, numeros.length);
    $('table.tit:contains("POZO EXTRA")').first()
      .next().next()
      .find('table')
      .find('td')
      .each((i, el) => {
        numeros.push((`0000${$(el).text().trim()}`).slice(-2));
      });
      $('table.tit:contains("POZO EXTRA")').first()
      .next().next()
      .next()
      .find('table')
      .find('td')
      .each((i, el) => {
        numeros.push((`0000${$(el).text().trim()}`).slice(-2));
      });
    $('table.tit:contains("POZO EXTRA")').first()
      .next().next()
      .next()
      .next()
      .find('table')
      .find('td')
      .each((i, el) => {
        numeros.push((`0000${$(el).text().trim()}`).slice(-2));
      });
    retorno.resultados[4] = {
      titulo: 'POZO EXTRA',
      numeros: numeros.toString(),
      premios: []
    };
    $('table.tit:contains("PREMIOS POZO EXTRA")').first().next('table')
      .find('tr')
      .each((i, el) => {
        if ($(el).text().trim().includes('Ganad.')) {
          return true;
        }
        const st = $(el).find('td').toArray();
        retorno.resultados[4].premios.push({
          aciertos: '6',
          ganadores: $(st[0]).text().trim(),
          premio: $(st[1]).text().trim(),
        });
      });
    return retorno;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return false;
  }
};

export async function tuJugadaResultados(req, res) {
  if (req.params.sorteoNro !== undefined) {
    try {
      const datos = await obtenerResultadosSorteo(req.params.sorteoNro);
      return res.status(200).json({ status: 200, message: 'Resultados del sorteo obtenidos exitosamente', data: datos });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  } else {
    return res.status(500).json({ status: 500, message: 'Debe enviar el parametro sorteoNro' });
  }
}
