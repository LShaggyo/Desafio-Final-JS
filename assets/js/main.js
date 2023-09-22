// Definir la URL base de la API a consultar.
const url = "https://mindicador.cl/api/";

// Establecer un 'event listener' para el botón "Buscar". Este se activa al hacer clic en el botón.
document.getElementById('buscar').addEventListener('click', async () => {
    const valorCLP = document.getElementById('pesosCLP').value;
    const monedaElegida = document.getElementById('moneda').value;
    const parrafoResultado = document.getElementById('resultado');

    // Petición a la API.
    try {
        // Datos de la moneda seleccionada a la API.
        const respuesta = await fetch(url + monedaElegida);        
        // Si hay algún problema con la respuesta, mensaje de error
        if (!respuesta.ok) {
            throw new Error('Error en la petición');
        }

        // Convertir la respuesta en un objeto JSON.
        const data = await respuesta.json();

        // Obtenemos el valor actual de la moneda.
        const valorMoneda = data.serie[0].valor;

        // Calcular cuánto equivale el valor ingresado en la moneda seleccionada.
        const calculo = valorCLP / valorMoneda;
        const calculoRedondeado = calculo.toFixed(2);

        // Mostrar el resultado de la conversión en el DOM.
        parrafoResultado.innerText = `${valorCLP} CLP equivale a ${calculoRedondeado} ${monedaElegida.toUpperCase()}`;

        // Datos para el gráfico.
        const labels = data.serie.map(entry => formatDate(entry.fecha)).slice(0, 10);
        const values = data.serie.map(entry => entry.valor).slice(0, 10);

        // Elimina un grafico previamente renderizado.
        if (window.chartInstance) {
            window.chartInstance.destroy();
        }

        // Renderizar el gráfico con los datos de la API.
        window.chartInstance = new Chart(document.getElementById('myChart'), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valores',
                    data: values,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    fill: false,
                }],
            }
        });

    } catch (error) { // En caso de error, mostramos el mensaje en el DOM.
        parrafoResultado.innerText = `Error: ${error.message}`;
    }
});

// Función para formatear las fechas de la API.
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-CL', options);
}
