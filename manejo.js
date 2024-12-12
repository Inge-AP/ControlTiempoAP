const apiUrl = 'http://localhost:4000/records'; // Reemplaza esto con tu endpoint
const backendUrl = 'http://localhost:3000/api/guardar-datos';

fetch(apiUrl).then(response => response.json()).then(data => {
    const dataDiv = document.getElementById('data');
    //const rowUl = document.createElement('ul')
    data.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.textContent = `Name: ${row.Name}, Open Time: ${row['Open_Time']}`;
        dataDiv.appendChild(rowDiv);
    });
    document.getElementById("Cargar").addEventListener("click", function() {
        enviaraBD(data);
    });
}).catch(error => console.error('Error al obtener los datos:', error));

function enviaraBD(data){
    const dataf = filtrarProcesar(data);
    const datosp = procesarDatos(dataf);
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify(datosp)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar los datos');
        }
        return response.json(); // Parseamos la respuesta como JSON
    })
    .then(result => {
        console.log('Datos enviados correctamente:', result);
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error);
    });
}

function diferenciaConMoment(entrada, salida){
    const duracion = moment.duration(salida.diff(entrada))
    duracion.subtract(9,'hours');
    duracion.subtract(30,'minutes');
    if(duracion.seconds()>30){
        duracion.add(1, 'minutes');
        duracion.subtract(duracion.seconds(), 'seconds')
    }
    const horas = duracion.hours();
    var minutos = duracion.minutes();
    console.log(horas,":",minutos);
    if(horas==0 && minutos >= 0){
        minutos = 0;
    }

    console.log(horas,":",minutos);
    console.log("siguiente");
    //const segundos = duracion.seconds();
    return {horas, minutos}
}

function organizarTiempoMoment(data){
    data.forEach(item => {
        item.Open_Time = moment(item.Open_Time, 'YYYY-MM-DD HH:mm:ss');
        const openTime = moment(item.Open_Time, 'YYYY-MM-DD HH:mm:ss')
        item.Fecha = openTime.format('YYYY-MM-DD')
    });
}

function filtrarProcesar(data){
    organizarTiempoMoment(data);
    return data.map(row => ({
        ID: row.ID,
        Name: row.Name,
        Open_Time: row.Open_Time,
        Fecha: row.Fecha
    }));
}

function sinHuella(primero){
    const ultimo = { ...primero};
    const adjustedTime = moment(primero.Open_Time).hours(17).minutes(0).seconds(0).milliseconds(0);
    ultimo.Open_Time = moment(adjustedTime.format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
    return ultimo;
}

function procesarDatos(data){
    console.log("data",data);
    const agrupados = {};
    data.forEach(item => {
        const clave = `${item.Fecha}-${item.ID}`;
        if(!agrupados[clave]) {
            agrupados[clave] = [];
        }
        agrupados[clave].push(item); 
    });
    const datosProcesados = [];
    for (const clave in agrupados) {
        const grupo = agrupados[clave];
        const primero = grupo[0];
        const ultimo = grupo.length > 1 ? grupo[grupo.length - 1]:  sinHuella(primero);
        const ext = diferenciaConMoment(primero.Open_Time, ultimo.Open_Time);
        // Unir los registros en uno solo
        const procesado = {
            ID: primero.ID,
            Name: primero.Name,
            Entrada: primero.Open_Time,
            Salida: ultimo.Open_Time, // Puede ser nulo si solo hay un registro
            Fecha: primero.Fecha,
            Extras: ext
        };

        datosProcesados.push(procesado);
    }

    return datosProcesados;
}

