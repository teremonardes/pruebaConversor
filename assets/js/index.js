const apiURL = "https://mindicador.cl/api/";

async function getMonedas() {
  try {
    const divMoneda = document.querySelector("#moneda");
    const res = await fetch(apiURL);
    const data = await res.json();

    console.log(data);

    // mostrar monedas

    let htmlMoneda = `
      <select id="selectMonedaInput">
        <option value="" disabled selected>Selecciona una moneda</option>
        <option value="euro">${data["euro"].nombre}</option>
        <option value="uf">${data["uf"].nombre}</option>
      </select>
    `;

    divMoneda.innerHTML = htmlMoneda;

    const inputPesos = document.querySelector("#pesos");
    const convertir = document.querySelector("#convertir");
    const selectMoneda = document.querySelector("#selectMonedaInput");
    const resultado = document.querySelector("#resultadoConversion");

    convertir.addEventListener("click", async () => {
      const pesos = parseFloat(inputPesos.value);
      let monedaSeleccionada = selectMoneda.value;

      //  que ingrese numero
      if (isNaN(pesos)) {
        resultado.innerHTML = `<p>Por favor, ingresa un valor numérico válido.</p>`;
        return;
      }

      let conversion = 0;
      let resultadoHtml = "";

      if (monedaSeleccionada === "euro") {
        conversion = pesos / data["euro"].valor;
        resultadoHtml = `<p>$${pesos} pesos son $${conversion.toFixed(
          2
        )} euros.</p>`;
        await renderGrafica("euro");
      } else if (monedaSeleccionada === "uf") {
        conversion = pesos / data["uf"].valor;
        resultadoHtml = `<p> $${pesos} pesos son $${conversion.toFixed(
          2
        )} UF.</p>`;
        await renderGrafica("uf");
      }
      resultado.innerHTML = resultadoHtml;
    });
  } catch (error) {
    const errorSpan = document.getElementById("errorSpan");
    errorSpan.innerHTML = `Algo salió mal! Error: ${error.message}`;
  }
}
getMonedas();

// java grafica

async function getHistorial(moneda) {
  const endpoint = `https://mindicador.cl/api/${moneda}`;
  const res = await fetch(endpoint);
  const data = await res.json();
  return data.serie;
}

function filtrarUltimos10Dias(data) {
  const hoy = new Date();
  return data.filter((entry) => {
    const fecha = new Date(entry.fecha);

    return (hoy - fecha) / (1000 * 60 * 60 * 24) <= 10;
  });
}

function prepararConfiguracionParaLaGrafica(data, moneda) {
  // Creamos las variables necesarias para el objeto de configuración
  const tipoDeGrafica = "line";
  const labels = data.map((entry) =>
    new Date(entry.fecha).toLocaleDateString()
  ).reverse();
  const valores = data.map((entry) => entry.valor).reverse();

  const titulo = `Valor del ${moneda === "euro" ? "Euro" : "UF"}`;
  const colorDeLinea = "red";

  const config = {
    type: tipoDeGrafica,
    data: {
      labels: labels,
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          data: valores,
        },
      ],
    },
  };
  return config;
}
let chartInstance = null;

async function renderGrafica(moneda) {
  const historial = await getHistorial(moneda);
  const ultimos10Dias = filtrarUltimos10Dias(historial);
  const config = prepararConfiguracionParaLaGrafica(ultimos10Dias, moneda);
  const chartDOM = document.getElementById("myChart");
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartDOM, config);
}