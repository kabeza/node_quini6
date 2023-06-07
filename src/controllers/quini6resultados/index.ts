import express from 'express';
import * as cheerio from 'cheerio';
import { Sorteo } from '../../interfaces/Sorteo';
import { ResultadoSorteo } from '../../interfaces/ResultadosSorteo';
import { Numero, TodosLosNumeros } from '../../interfaces/TodosLosNumeros';

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

const obtenerResultadoSorteo = async (nroSorteo: number) : Promise<ResultadoSorteo> => {
  const listaSorteos = await obtenerListaSorteos();
  const resBusca = searchJSON(listaSorteos, 'numero', nroSorteo.toString());
  const url2Get = resBusca[0].link;
  // const retorno = {} as ResultadoSorteo;
  const retorno:ResultadoSorteo = {
    infoSorteo: resBusca,
    resultados: [],
  };

  return new Promise(async (resolve, reject) => {

    try {

      const response = await axios.get(url2Get);
      const $ = cheerio.load(response.data);
      
      // 1 SORTEO TRADICIONAL
      retorno.resultados.push({
        titulo: 'SORTEO TRADICIONAL',
        numeros: $('h3:contains("SORTEO TRADICIONAL")').next()
          .text().trim()
          .replace(/-/g, ',')
          .replace(/\s/g, ''),
        premios: [],
      });
      $('tr.verde:contains("SORTEO TRADICIONAL")').nextUntil('tr.verde').each((i, el) => {
        const st = $(el).find('td').toArray();
        retorno.resultados[0].premios.push({
          aciertos: $(st[0]).text().trim(),
          ganadores: $(st[1]).text().trim(),
          premio: $(st[2]).text().trim(),
        });
      });

      // 2 LA SEGUNDA DEL QUINI
      retorno.resultados.push({
        titulo: 'LA SEGUNDA DEL QUINI',
        numeros: $('h3:contains("LA SEGUNDA DEL QUINI")').next()
          .text().trim()
          .replace(/-/g, ',')
          .replace(/\s/g, ''),
        premios: [],
      });
      $('tr.verde:contains("LA SEGUNDA DEL QUINI 6")').first().nextUntil('tr.verde').each((i, el) => {
        const sq = $(el).find('td').toArray();
        retorno.resultados[1].premios.push({
          aciertos: $(sq[0]).text().trim(),
          ganadores: $(sq[1]).text().trim(),
          premio: $(sq[2]).text().trim(),
        });
      });

      // 3 SORTEO REVANCHA
      retorno.resultados.push({
        titulo: 'SORTEO REVANCHA',
        numeros: $('h3:contains("SORTEO REVANCHA")').next()
          .text().trim()
          .replace(/-/g, ',')
          .replace(/\s/g, ''),
        premios: [],
      });
      $('tr.verde:contains("LA SEGUNDA DEL QUINI 6 REVANCHA")').nextUntil('tr.verde').each((i, el) => {
        const sqr = $(el).find('td').toArray();
        retorno.resultados[2].premios.push({
          aciertos: $(sqr[0]).text().trim(),
          ganadores: $(sqr[1]).text().trim(),
          premio: $(sqr[2]).text().trim(),
        });
      });

      // 4 SIEMPRE SALE
      retorno.resultados.push({
        titulo: 'SIEMPRE SALE',
        numeros: $('h3:contains("QUE SIEMPRE SALE")').next()
          .text().trim()
          .replace(/-/g, ',')
          .replace(/\s/g, ''),
        premios: [],
      });
      $('tr.verde:contains("EL QUINI QUE SIEMPRE SALE")').nextUntil('tr.verde').each((i, el) => {
        const qqsl = $(el).find('td').toArray();
        retorno.resultados[3].premios.push({
          aciertos: $(qqsl[0]).text().trim(),
          ganadores: $(qqsl[1]).text().trim(),
          premio: $(qqsl[2]).text().trim(),
        });
      });

      // 5 POZO EXTRA
      retorno.resultados.push({
        titulo: 'POZO EXTRA',
        numeros: 'Se reparte entre los que tengan seis aciertos contando los tres primeros sorteos. Los números repetidos se cuentan solo una vez.',
        premios: [],
      });
      $('tr.verde:contains("QUINI 6 POZO EXTRA")').nextUntil('tr.verde').each((i, el) => {
        const qpe = $(el).find('td').toArray();
        retorno.resultados[4].premios.push({
          aciertos: $(qpe[0]).text().trim(),
          ganadores: $(qpe[1]).text().trim(),
          premio: $(qpe[2]).text().trim(),
        });
      });
      
      resolve(retorno);

    } catch (error) {
      reject(error);
    }
  });
};

const obtenerTodosLosSorteos = async () : Promise<ResultadoSorteo[]> => {
  const listaSorteos = await obtenerListaSorteos();
  listaSorteos.sort((a, b) => {  
    return parseInt(a.sorteo.numero) <= parseInt(b.sorteo.numero) ? 1 : -1;
  });
  return Promise.all(listaSorteos.map((item) => {
    return obtenerResultadoSorteo(parseInt(item.sorteo.numero));
  }));
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
      const datos = await obtenerResultadoSorteo(parseInt(req.params.sorteoNro));
      return res.status(200).json({ message: 'Resultados del sorteo obtenidos exitosamente', data: datos });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  } else {
    return res.status(500).json({ status: 500, message: 'Debe enviar el parametro sorteoNro' });
  }  
});

router.get('/todoslosnumeros', async (req, res) => {
  try {
    const datos = await obtenerTodosLosSorteos();

    let datosFinales:TodosLosNumeros = {
      tiposorteo: [],
    };
    
    let numerosTradicional : Numero[] = [];
    let numerosSegunda : Numero[] = [];
    let numerosRevancha : Numero[] = [];
    let numerosSiempreSale : Numero[] = [];
    let numArre:any[] = []; // Para almacenar de cuajo todos los numeros
    for (let dd = 0; dd < datos.length; dd++) {
      let dataSorteo = datos[dd];
      for (let ds = 0; ds < dataSorteo.resultados.length; ds++) {
        if (dataSorteo.resultados[ds].titulo == 'POZO EXTRA') {
        } else {
          switch (dataSorteo.resultados[ds].titulo) { 
            case 'SORTEO TRADICIONAL': { 
              numerosTradicional.push({
                fecha: datos[dd].infoSorteo[0].fecha,
                numero: datos[dd].infoSorteo[0].numero,
                numeros: dataSorteo.resultados[ds].numeros,
              });
              break; 
            } 
            case 'LA SEGUNDA DEL QUINI': { 
              numerosSegunda.push({
                fecha: datos[dd].infoSorteo[0].fecha,
                numero: datos[dd].infoSorteo[0].numero,
                numeros: dataSorteo.resultados[ds].numeros,
              });
              break; 
            } 
            case 'SORTEO REVANCHA': { 
              numerosRevancha.push({
                fecha: datos[dd].infoSorteo[0].fecha,
                numero: datos[dd].infoSorteo[0].numero,
                numeros: dataSorteo.resultados[ds].numeros,
              });
              break; 
            } 
            case 'SIEMPRE SALE': { 
              numerosSiempreSale.push({
                fecha: datos[dd].infoSorteo[0].fecha,
                numero: datos[dd].infoSorteo[0].numero,
                numeros: dataSorteo.resultados[ds].numeros,
              });
              break; 
            } 
            default: { 
              //statements; 
              break; 
            }
          }
          numArre.push(dataSorteo.resultados[ds].numeros);
        }
      }
    }

    // 1 SORTEO TRADICIONAL
    datosFinales.tiposorteo.push({
      titulo: 'SORTEO TRADICIONAL',
      numeros: numerosTradicional,
    });

    // 2 SORTEO LA SEGUNDA
    datosFinales.tiposorteo.push({
      titulo: 'LA SEGUNDA DEL QUINI',
      numeros: numerosSegunda,
    });

    // 3 SORTEO REVANCHA
    datosFinales.tiposorteo.push({
      titulo: 'SORTEO REVANCHA',
      numeros: numerosRevancha,
    });
    
    // 4 SIEMPRE SALE
    datosFinales.tiposorteo.push({
      titulo: 'SIEMPRE SALE',
      numeros: numerosSiempreSale,
    });

    res.status(200).json({
      message: 'Todos los números históricos obtenidos exitosamente',
      data: datosFinales,
      todosLosNumerosEver: numArre,
    });

  } catch (error) {
    return res.status(400).json({ message: error });
  }  
});

export default router;
