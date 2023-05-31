import * as cheerio from 'cheerio';

const axios = require('axios').default;

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

const obtenerListaSorteos = async () => {
  const url2Get = 'https://www.tujugada.com.ar/quini6.asp';
  try {
    const response = await axios.get(url2Get);
    const $ = cheerio.load(response.data);
    const resp = [];
    /*
    $('div.tit:contains("RESULTADOS ANTERIORES")').nextUntil('div#pie').each((i, el) => {
      console.log(`${i} => ${$(el).text()}`);
    });
    */
    $('div.ante').each((i, el) => {
      resp[i] = {
        sorteo: {
          numero: $(el).text().trim().substring(15, 19),
          titulo: insert($(el).text().trim(), 19, ' '),
          fecha: $(el).text().trim().slice($(el).text().trim().indexOf(':') + 1).trim(), // tit[1].replace(/-/g, '/').trim(),
          link: `https://www.tujugada.com.ar/quini6.asp?sorteo=${$(el).text().trim().substring(15, 19)}`
        }
      };
      console.log(`${i} => ${$(el).text().trim()}`);
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
  try {
    return sorteoNro;
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
