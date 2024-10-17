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

    // tomar input pesos
    const inputPesos = document.querySelector("#pesos");

    // función botón

    const convertir = document.querySelector("#convertir");
    const selectMoneda = document.querySelector("#selectMonedaInput");
    const resultado = document.querySelector("#resultadoConversion");

    convertir.addEventListener("click", () => {
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
      } else if (monedaSeleccionada === "uf") {
        conversion = pesos / data["uf"].valor;
        resultadoHtml = `<p> $${pesos} pesos son $${conversion.toFixed(
          2
        )} UF.</p>`;
      }
      resultado.innerHTML = resultadoHtml;
    });
  } catch (error) {
    const errorSpan = document.getElementById("errorSpan");
    errorSpan.innerHTML = `Algo salió mal! Error: ${error.message}`;
  }
}
getMonedas();
