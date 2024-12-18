const { FILE } = require('dns');
const fs = require('fs');
const{ DOMParser } = require('xmldom')
const backendUrl = 'http://localhost:3000/api/guardar-datos';
const procesadoModel = require('../models/modelo')

function proccesXML(callback) {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(event.target.result, 'application/xml');
        const rows = xml.getElementsByTagName('Row');
        const data = [];

        for (let i = 1; i < rows.length; i++) {  // Empezar desde 1 para saltar el primer elemento
            const cells = rows[i].getElementsByTagName('Cell');
            if (cells.length === 5) {
                const id = cells[1].textContent.trim();
                if (id !== '' && !id.includes('User')) {  // Omitir elementos vacíos en el campo ID
                    const entry = {
                        "SN": cells[0].textContent,
                        "ID": id,
                        "Name": cells[2].textContent,
                        "Open_Time": cells[3].textContent,
                        "Verify": cells[4].textContent
                    };
                    data.push(entry);
                }
            }
        }
        let jsonString = '{\n    "records": [\n';
        data.forEach((entry, index)=>{
            jsonString += `        ${JSON.stringify(entry)}`;
            if (index < data.length - 1){
                jsonString += ',\n';
            } else {
                jsonString += '\n';
            }
        });
        const jsonObject = JSON.parse(jsonString);
        const result = ordenarDatos(jsonObject);
        enviaraBD(result);
    }
    reader.readAsText(file);
}

function ordenarDatos(data) {
    const dataf = filtrarProcesar(data);
    const datosp = procesarDatos(dataf);
    return datosp;
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

function organizarTiempoMoment(data){
    data.forEach(item => {
        item.Open_Time = moment(item.Open_Time, 'YYYY-MM-DD HH:mm:ss');
        const openTime = moment(item.Open_Time, 'YYYY-MM-DD HH:mm:ss')
        item.Fecha = openTime.format('YYYY-MM-DD')
    });
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

function sinHuella(primero){
    const ultimo = { ...primero};
    const adjustedTime = moment(primero.Open_Time).hours(17).minutes(0).seconds(0).milliseconds(0);
    ultimo.Open_Time = moment(adjustedTime.format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss');
    return ultimo;
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

function enviaraBD(data){
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            'content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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

async function getDataById(ID) {
    return await procesadoModel.getRecordById(ID)
}

module.exports = {proccesXML, getDataById};