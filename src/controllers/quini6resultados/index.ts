import express from 'express';
import * as cheerio from 'cheerio';

const axios = require('axios').default;
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Sitio: https://www.quini-6-resultados.com.ar/',
  });
});

interface Sorteo {
  sorteo: {
    numero: string,
    titulo: string,
    fecha: string,
    link: cheerio.Element | string | undefined
  }
}

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

router.get('/sorteos', async (req, res) => {
  try {
    const datos = await obtenerListaSorteos();
    res.status(200).json({
      message: 'Sorteos obtenidos exitosamente',
      cantidad: datos.length,
      data: datos,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.get('/resultados/:sorteoNro', async (req, res) => {
  // res.status(200).json({ parametro:req.params.sorteoNro });
  if (req.params.sorteoNro !== undefined) {
    try {
      const datos = (req.params.sorteoNro);
      return res.status(200).json({ message: 'Resultados del sorteo obtenidos exitosamente', data: datos });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } else {
    return res.status(500).json({ status: 500, message: 'Debe enviar el parametro sorteoNro' });
  }  
});

export default router;
