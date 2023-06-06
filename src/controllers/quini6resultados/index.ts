import express from 'express';
import * as cheerio from 'cheerio';
import { Sorteo } from '../../interfaces/Sorteo';
import { ResultadoSorteo } from '../../interfaces/ResultadosSorteo';
import { Tiposorteo, TodosLosNumeros } from '../../interfaces/TodosLosNumeros';

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

const obtenerTodosLosNumeros = async () : Promise<TodosLosNumeros> => {
  const datosFinales:TodosLosNumeros = {
    tiposorteo: [],
  };
  const listaSorteos = await obtenerListaSorteos();
  listaSorteos.sort((a, b) => {  
    return parseInt(a.sorteo.numero) <= parseInt(b.sorteo.numero) ? 1 : -1;
  });
  
  let xx: any[] = [];

  Object.entries(listaSorteos).map(async item => {
    const respuesta = await obtenerResultadoSorteo(parseInt(item[1].sorteo.numero));
    xx.push(respuesta);
  });
  console.log('Respuesta: ' + JSON.stringify(xx));
  
  return datosFinales;
};


const obtenerTodosLosNumeros1 = async () : Promise<TodosLosNumeros> => {
  const datosFinales:TodosLosNumeros = {
    tiposorteo: [],
  };

  // let datosCompleto: ResultadoSorteo[] = [];
  
  try {
    const listaSorteos = await obtenerListaSorteos();
    listaSorteos.sort((a, b) => {  
      return parseInt(a.sorteo.numero) <= parseInt(b.sorteo.numero) ? 1 : -1;
    });

    datosFinales.tiposorteo.push({
      titulo: 'SORTEO TRADICIONAL',
      numeros: [],
    });
    datosFinales.tiposorteo.push({
      titulo: 'LA SEGUNDA DEL QUINI',
      numeros: [],
    });
    datosFinales.tiposorteo.push({
      titulo: 'SORTEO REVANCHA',
      numeros: [],
    });
    datosFinales.tiposorteo.push({
      titulo: 'SIEMPRE SALE',
      numeros: [],
    });

    Object.entries(listaSorteos).map(async item => {      
      // Solo para que haga el loop 2 veces
      if (parseInt(item[0], 10) <= 1) {
        // // let numeroSorteo = item[1].sorteo.numero;
        // // const dataSorteo = await obtenerResultadoSorteo(parseInt(numeroSorteo));
        // // console.log(dataSorteo);
        // datosCompleto.push(dataSorteo);
        // console.log(item[1]);
        /*
        Object.entries(dataSorteo.resultados).map(item1 => {
          datosFinales.tiposorteo.forEach(function (val1:Tiposorteo) {
            // console.log(val1);
            if (item1[1].titulo == val1.titulo) {
              // console.log('-------SI------');
              val1.numeros.push({
                numero: item[1].sorteo.numero,
                fecha: item[1].sorteo.fecha,
                numeros: item1[1].numeros,
              });
            }
          });
        });        
        */
        /*
        Object.entries(await dataSorteo.resultados).map(item1 => {
          // tmpData.numeros.push(item1[1].numeros);
          // console.log(item1);          
          if (item1[1].titulo == 'POZO EXTRA') { 
            return false; 
          } else {
            Object.entries(datosFinales.tiposorteo).map(item2 => {
              if (item2[1].titulo == item1[1].titulo) {
                console.log('----------SI---------');
                
              }
              switch (item1[1].titulo) { 
                case '': { 
                  //statements; 
                  break; 
                } 
                case '': { 
                  //statements; 
                  break; 
                } 
                case '': { 
                  //statements; 
                  break; 
                } 
                default: { 
                  //statements; 
                  break; 
                }
              } 
              // console.log('------------');
              // console.log(item2[1]);
            });
          }
          // console.log(item1[1].titulo);
        });
        */
        // console.log(item[1].sorteo.numero);
        // console.log(item[1].sorteo.link);
        // console.log(item[1].sorteo.fecha);
        // console.log(item[1].sorteo.titulo);
        // console.log(item1[1]);
        // objSorteo = JSON.parse(JSON.stringify(dataSorteo));
      }
    });
    // console.log('Datos Finales: ' + JSON.stringify(datosFinales));

    // console.log(dataSorteo);
    // console.log(objSorteo);
    // const newData = JSON.parse(JSON.stringify(dataFinal));
    Object.entries(listaSorteos).map(async item => {
      if (parseInt(item[0], 10) <= 0) {
        // let numeroSorteo = item[1].sorteo.numero;
        // console.log(item[1].sorteo.numero);
        // console.log(item[1].sorteo.link);
        /*
        const dataSorteo = await obtenerResultadoSorteo(parseInt(numeroSorteo));
        const objSorteo = JSON.parse(JSON.stringify(dataSorteo));
        let canti = 0;
        Object.entries(dataSorteo).map(item2 => {
          console.log(item2[0]);
          console.log(`Cantidad: =====> ${canti++}`);
          console.log(item2[1]);
          console.log('Datos -----');
          console.log(item2[1][0].numero);
          // console.log(item2['infoSorteo'].numero);
          // console.log(item2['resultados'][0].titulo);
        });
        */
        /*
        const resuSorteo = JSON.parse(JSON.stringify(await obtenerResultados(numeroSorteo)));
        console.log(typeof resuSorteo);
        // console.log(resuSorteo);
        // console.log(resuSorteo);
        Object.keys(resuSorteo).map(key => {
          const item1 = resuSorteo[key];
          // console.log(item1);
        });
        */
        // console.log(extracted);
        // console.log('=======');
        // const objects = resuSorteo.keys(data).map(key => data[key]);
        // console.log(objects);
        /*
        resuSorteo.resultados.each(el => {
          console.log(el);
        });
        */
        /*
        const results = Object.entries(resuSorteo);
        results.forEach(el => {
          console.log(el[1]);
        });
        */
      }
    });
  } catch (error) {
    console.log(error);
  }
  // console.log(datosCompleto);
  return datosFinales;
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
    const datos = await obtenerTodosLosNumeros();
    res.status(200).json({
      message: 'Todos los números históricos obtenidos exitosamente',
      data: datos,
    });
  } catch (error) {
    return res.status(400).json({ message: error });
  }  
});

export default router;
