// https://www.tujugada.com.ar/quini6.asp
// https://www.quini-6-resultados.com.ar/
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
  try {
    const response = await axios.get(url2Get);
    const $ = cheerio.load(response.data);
    const resp = [];
    $('div.col-md-5 h3.verdeyblanco').each((i, el) => {
      // eslint-disable-next-line no-console
      console.log($(el).text());
      console.log($(el).closest('p').text());
      /*
      resp[i] = {
        sorteo: {
          titulo: $(el).text(),
          fecha: tit[1].trim(),
          link: $(el).attr('href')
        }
      };
      */
    });
    return resp;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return false;
  }
};

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
