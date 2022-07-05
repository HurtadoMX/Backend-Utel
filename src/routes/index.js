const { Router } = require("express");
const axios = require("axios");
const { response } = require("../app/app");
const fetch = require("node-fetch");

const router = Router();

const error = [
  {
    id: "ERROR",
    title: "ESA PUBLICACION NO EXISTE, INTENTE CON OTRA",
    price: 00000000,
    currency_id: ["---", "---"],
    available_quantity: 1,
    thumbnail: "https://cdn-icons-png.flaticon.com/512/2748/2748558.png",
    condition: "NO ENCONTRADO",
  },
];

const apiArray = [];
const peticion = async () => {
  let ifo = [];
  const info = await fetch(
    `https://api.mercadolibre.com/sites/MLA/search?q={setup}`
  )
    .then((response) => response.json())
    .then((resp) => ifo.push(resp));

  // console.log(info)
  // console.log(ifo[0].results)
  const infoFiltrada = ifo[0].results.map((e) => {
    apiArray.push({
      id: e.id,
      title: e.title,
      price: e.price,
      currency_id: e.prices.prices.map((e) => e.currency_id),
      available_quantity: e.available_quantity,
      thumbnail: e.thumbnail,
      condition: e.condition,
    });
    return apiArray;
  });
};

peticion();

router.get("/api/search", async (req, res, next) => {
  try {
    let { q } = req.query;
    const errorMensaje = await error;
    const filtro = await apiArray;

    if (q) {
      let infoValida = await filtro.filter((e) =>
        e.title.toLowerCase().includes(q.toLowerCase())
      );
      infoValida.length
        ? res.status(200).json(infoValida)
        : res.send(errorMensaje);
    } else {
      return res.status(200).json(filtro);
    }
  } catch (error) {
    next(error);
  }
});

router.get("/api/:price", async (req, res, next) => {
  const { price } = req.params;

  const filtro = await apiArray;

  try {
    // const infoOrdenada2 = infoOrdenada.map(e=>e.nombre)
    // console.log(infoOrdenada2)
    if (price === "ALL") {
      return res.status(200).json(apiArray);
    }
    if (price === "asc") {
      apiArray.sort((a, b) => {
        if (a.price > b.price) {
          return 1;
        }
        if (b.price > a.price) {
          return -1;
        }
        return 0;
      });
    } else if (price === "desc") {
      apiArray.sort((a, b) => {
        if (a.price > b.price) {
          return -1;
        }
        if (b.price > a.price) {
          return 1;
        }
        return 0;
      });
    }
    // console.log(infoOrdenada)
    return res.status(200).json(apiArray);
  } catch (error) {
    console.log(error);
  }
});

router.get("/condition", async (req, res, next) => {
  console.log("hola");

  try {
    let { condicion } = req.query;

    const filtro = await apiArray;

    if (condicion === "ALL") {
      res.status(200).json(filtro);
    }

    if (condicion) {
      let infoValida = await filtro.filter((e) => e.condition === condicion);
      infoValida.length
        ? res.status(200).json(infoValida)
        : res.status(500).json(error);
    } else {
      return res.status(500);
    }

    return res.status(200).json(filtro);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
