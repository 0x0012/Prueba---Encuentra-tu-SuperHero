// Mi script

// Captura de eventos
$(document).ready(() => {
    $('button').click(() => {   // Campura del click del botón buscar
        if (validarId()) {      // Valida ingreso numérico al buscar
            consultarApi()      // Consulta el número ingresado en la API superheroapi
        }
    })
})

// Validar búsqueda de SuperHero
const validarId = () => {
    const id = $('input').val()
    const validador = /^\d+$/g  // Solo un número entero positivo
    if (validador.test(id)) {
        return true
    } else {
        alert('Debes ingresar un número de SuperHero válido')
    }
}

// Consulta el SuperHero en la superheroapi y muestra los resultados
const consultarApi = () => {
    const dominio = 'https://superheroapi.com/api.php'  // Se agregó ".php" para evitar bloqueo por CORS
    const token = '10227562276425336'                   // Token Access para consultar superheroapi
    const recurso = $('input').val()                    // id del SuperHero ingresado

    $.ajax({
        type: 'GET',
        url: dominio + '/' + token + '/' + recurso,
        dataType: 'json',
        success: datos => {
            if (datos.response != 'error') {            // La api retorna un success con un número fuera del rango disponible, pero con este mensaje
                // Panel de información
                $('#info').show();                      // Mostrar panel de información oculto
                $('#lafotito').attr('src', datos.image.url)
                $('.card-title').text('Nombre: ' + datos.name)
                $('.card-text:eq(0)').text('Conexiones: ' + datos.connections['group-affiliation'] + ' ; ' + datos.connections.relatives)
                $('.card-text:eq(1)').text('Publicado por: ' + datos.biography.publisher)
                $('.card-text:eq(2)').text('Ocupación: ' + datos.work.occupation)
                $('.card-text:eq(3)').text('Primera aparición: ' + datos.biography['first-appearance'])
                $('.card-text:eq(4)').text('Altura: ' + datos.appearance.height[1]) // Altura en centímetros
                $('.card-text:eq(5)').text('Peso: ' + datos.appearance.weight[1])   // Peso en kilogramos
                $('.card-text:eq(6)').text('Alias: ' + datos.biography.aliases)     // En la maqueta dice alianzas, pero son los alias del SuperHero que van aquí

                // Panel de estadísticas
                $('#stats').show()                      // Mostrar panel de estadísticas oculto
                var chart = new CanvasJS.Chart('stats',
                    {
                        theme: 'light1',
                        title: {
                            text: 'Estadísticas de Poder para ' + datos.name
                        },
                        data: [
                            {
                                type: 'pie',
                                showInLegend: true,
                                toolTipContent: '{y}',
                                legendText: '{indexLabel}',
                                dataPoints:             // Cargar los datos estadísticos del SuperHero al gráfico
                                [
                                    { y: datos.powerstats.intelligence, indexLabel: 'Inteligencia' },
                                    { y: datos.powerstats.strength, indexLabel: 'Fuerza' },
                                    { y: datos.powerstats.speed, indexLabel: 'Velocidad' },
                                    { y: datos.powerstats.durability, indexLabel: 'Durabilidad' },
                                    { y: datos.powerstats.power, indexLabel: 'Poder' },
                                    { y: datos.powerstats.combat, indexLabel: 'Combate' }
                                ]
                            }
                        ]
                    });
                chart.render();
            } else {
                alert('No se pudo obtener la información de este SuperHero o no existe')    // La api retorna el error: "invalid id"
            }
        },
        error: e => {
            alert('No se pudo obtener la información de este SuperHero o no existe')        // No pudo completar la consulta a la api
        }
    })
}