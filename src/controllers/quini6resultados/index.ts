import express from 'express';
import * as cheerio from 'cheerio';
import { Sorteo, ResultadoSorteo } from '../../interfaces/Sorteo';

const axios = require('axios').default;
const router = express.Router();

const obtenerListaSorteos = async () : Promise<Sorteo[]> => {
  const url2Get = 'https://www.quini-6-resultados.com.ar/quini6/sorteos-anteriores.aspx';
  try {
    const response = await axios.get(url2Get);
    const $ = cheerio.load(response.data);
    const resp: Sorteo[] = [];
    $('div.col-md-3 p a').each((i, el) => {
      const tit = $(el).text().split('del ');
      resp[i] = {
        sorteo: {
          numero: tit[0].replace('Sorteo ', ''),
          titulo: tit[0],
          fecha: tit[1].replace(/-/g, '/').trim(),
          link: $(el).attr('href'),
        },
      };
    });
    return resp;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw (error);
  }
};

const searchJSON = (obj:any, key:any, val:any) => {
  let results :any = [];
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      if (k === key && obj[k] === val) {
        results.push(obj);
      } else if (typeof obj[k] === 'object') {
        results = results.concat(searchJSON(obj[k], key, val));
      }
    }
  }
  return results;
};

const obtenerResultadosSorteo = async (nroSorteo: number) : Promise<ResultadoSorteo> => {
  const listaSorteos = await obtenerListaSorteos();
  const resBusca = searchJSON(listaSorteos, 'numero', nroSorteo.toString());
  const url2Get = resBusca[0].link;
  // const retorno = {} as ResultadoSorteo;
  const retorno = {
    infoSorteo: resBusca,
    resultados: [],
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
      premios: [],
    };
    $('tr.verde:contains("SORTEO TRADICIONAL")').nextUntil('tr.verde').each((i, el) => {
      const st = $(el).find('td').toArray();
      retorno.resultados[0].premios.push({
        aciertos: $(st[0]).text().trim(),
        ganadores: $(st[1]).text().trim(),
        premio: $(st[2]).text().trim(),
      });
    });

  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
  return retorno;
};

router.get('/', (req, res) => {
  res.json({
    message: 'Sitio: https://www.quini-6-resultados.com.ar/',
  });
});

router.get('/sorteos', async (req, res) => {
  try {
    const datos = await obtenerListaSorteos();
    // Ordena los sorteos por número de sorteo (fecha) en orden descendiente (el ultimo sorteo primero)
    datos.sort((a, b) => {  
      return parseInt(a.sorteo.numero) <= parseInt(b.sorteo.numero)
        ? 1
        : -1;
    });
    res.status(200).json({
      message: 'Sorteos obtenidos exitosamente',
      cantidad: datos.length,
      data: datos,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get('/sorteo/:sorteoNro', async (req, res) => {
  if (req.params.sorteoNro !== undefined) {
    try {
      const datos = await obtenerResultadosSorteo(parseInt(req.params.sorteoNro));
      return res.status(200).json({ message: 'Resultados del sorteo obtenidos exitosamente', data: datos });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } else {
    return res.status(500).json({ status: 500, message: 'Debe enviar el parametro sorteoNro' });
  }  
});

export default router;
