import * as cheerio from 'cheerio';

const axios = require('axios').default;

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
  const url2Get = 'https://www.quini-6-resultados.com.ar/quini6/sorteos-anteriores.aspx';
  try {
    const response = await axios.get(url2Get);
    const $ = cheerio.load(response.data);
    const resp = [];
    $('div.col-md-3 p a').each((i, el) => {
      const tit = $(el).text().split('del ');
      resp[i] = {
        sorteo: {
          numero: tit[0].replace('Sorteo ', ''),
          titulo: tit[0],
          fecha: tit[1].replace(/-/g, '/').trim(),
          link: $(el).attr('href')
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

const obtenerResultados = async (sorteoNro) => {
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

    // 1 SORTEO TRADICIONAL
    retorno.resultados[0] = {
      titulo: 'SORTEO TRADICIONAL',
      numeros: $('h3:contains("SORTEO TRADICIONAL")').next()
        .text().trim()
        .replace(/-/g, ',')
        .replace(/\s/g, ''),
      premios: []
    };
    $('tr.verde:contains("SORTEO TRADICIONAL")').nextUntil('tr.verde').each((i, el) => {
      const st = $(el).find('td').toArray();
      retorno.resultados[0].premios.push({
        aciertos: $(st[0]).text().trim(),
        ganadores: $(st[1]).text().trim(),
        premio: $(st[2]).text().trim(),
      });
    });

    // 2 LA SEGUNDA DEL QUINI
    retorno.resultados[1] = {
      titulo: 'LA SEGUNDA DEL QUINI',
      numeros: $('h3:contains("LA SEGUNDA DEL QUINI")').next()
        .text().trim()
        .replace(/-/g, ',')
        .replace(/\s/g, ''),
      premios: []
    };
    $('tr.verde:contains("LA SEGUNDA DEL QUINI 6")').first().nextUntil('tr.verde').each((i, el) => {
      const sq = $(el).find('td').toArray();
      retorno.resultados[1].premios.push({
        aciertos: $(sq[0]).text().trim(),
        ganadores: $(sq[1]).text().trim(),
        premio: $(sq[2]).text().trim(),
      });
    });

    // 3 SORTEO REVANCHA
    retorno.resultados[2] = {
      titulo: 'SORTEO REVANCHA',
      numeros: $('h3:contains("SORTEO REVANCHA")').next()
        .text().trim()
        .replace(/-/g, ',')
        .replace(/\s/g, ''),
      premios: []
    };
    $('tr.verde:contains("LA SEGUNDA DEL QUINI 6 REVANCHA")').nextUntil('tr.verde').each((i, el) => {
      const sqr = $(el).find('td').toArray();
      retorno.resultados[2].premios.push({
        aciertos: $(sqr[0]).text().trim(),
        ganadores: $(sqr[1]).text().trim(),
        premio: $(sqr[2]).text().trim(),
      });
    });

    // 4 SIEMPRE SALE
    retorno.resultados[3] = {
      titulo: 'SIEMPRE SALE',
      numeros: $('h3:contains("QUE SIEMPRE SALE")').next()
        .text().trim()
        .replace(/-/g, ',')
        .replace(/\s/g, ''),
      premios: []
    };
    $('tr.verde:contains("EL QUINI QUE SIEMPRE SALE")').nextUntil('tr.verde').each((i, el) => {
      const qqsl = $(el).find('td').toArray();
      retorno.resultados[3].premios.push({
        aciertos: $(qqsl[0]).text().trim(),
        ganadores: $(qqsl[1]).text().trim(),
        premio: $(qqsl[2]).text().trim(),
      });
    });

    // 5 POZO EXTRA
    retorno.resultados[4] = {
      titulo: 'POZO EXTRA',
      numeros: 'Se reparte entre los que tengan seis aciertos contando los tres primeros sorteos. Los números repetidos se cuentan solo una vez.',
      premios: []
    };
    $('tr.verde:contains("QUINI 6 POZO EXTRA")').nextUntil('tr.verde').each((i, el) => {
      const qpe = $(el).find('td').toArray();
      retorno.resultados[4].premios.push({
        aciertos: $(qpe[0]).text().trim(),
        ganadores: $(qpe[1]).text().trim(),
        premio: $(qpe[2]).text().trim(),
      });
    });
    return retorno;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return false;
  }
};

const obtenerTodosLosNumeros = async () => {
  const listaSorteos = await obtenerListaSorteos();
  const dataFinal = {
    cantidad: 0,
    sorteos: []
  };
  Object.entries(listaSorteos).map(item => {
    // console.log(item[1]);
    let x = { JSON.parse(item[1]) };
    dataFinal.cantidad += 1;
    dataFinal.sorteos.push(item[1]);
  });
  console.log(dataFinal);
  return dataFinal;
  /*
  const datos = Object.entries(listaSorteos);
  let cant = 0;
  datos.map(item => {
    cant++;
  });
  const dataFinal = {
    cantidad: cant,
    datos: listaSorteos
  };
  console.log(dataFinal);
  const jsonObj = JSON.parse(dataFinal);
  console.log(jsonObj);
  // console.log(listaSorteos);
  */
  /*
  const datos = Object.entries(listaSorteos);
  datos.map(item => {
    console.log(item[0]); // key
    console.log(item[1]); // value
    const jsonObj = JSON.parse(item[1]);
    console.log(jsonObj);
  });
  */
};

/*
    ========================
    Todos los Exports
    ========================
*/

export async function quini6Sorteos(req, res) {
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

export async function quini6Resultados(req, res) {
  if (req.params.sorteoNro !== undefined) {
    try {
      const datos = await obtenerResultados(req.params.sorteoNro);
      return res.status(200).json({ status: 200, message: 'Resultados del sorteo obtenidos exitosamente', data: datos });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  } else {
    return res.status(500).json({ status: 500, message: 'Debe enviar el parametro sorteoNro' });
  }
}

export async function quini6TodosLosNumeros(req, res) {
  try {
    const datos = await obtenerTodosLosNumeros();
    return res.status(200).json({ status: 200, message: 'Resultados del sorteo obtenidos exitosamente', data: datos });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
}
