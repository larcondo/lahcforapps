const express = require('express');
const axios = require('axios');

const app = express();

const PORT = process.env.PORT || 3000;
const INTERVAL = 5 * 60 * 1000;
const TIMEOUT = 3 * 60 * 1000;
// const INTERVAL = 20 * 1000;
const myUrl = 'https://mispagos.onrender.com/info'

// Show logs - Disabled by default
let logEnable = false
let logArray = [];

const appsStatus = {
  app1: {
    nombre: 'mispagos',
    estado: {
      lastSuccess: null,
      lastSuccessStatus: null,
      lastError: null,
      lastErrorMessage: null,
    },
  },
}

function logToConsole(input) {
  if (logEnable) {
    console.log(input);
  }
}

function storeLog(input) {
  if (logArray.length < 10) {
    // logArray.push(input);
    logArray.unshift(input);
  } else {
    // logArray.shift();
    logArray.pop();
    // logArray.push(input);
    logArray.unshift(input);
}
}

function consultaMisPagos() {
  const fecha = new Date();
  
  axios.get(myUrl, { timeout: TIMEOUT })
    .then(response => {
      appsStatus.app1.estado = {
        lastSuccess: fecha.toISOString(),
        lastSuccessStatus: response.status,
        lastError: null,
        lastErrorMessage: null,
      }
      // loguear acción
      logToConsole(`${response.status} - ${fecha.toISOString()}`);
      storeLog(`${response.status} - ${fecha.toISOString()}`);
    })
    .catch(err => {
      console.log(err.message);
      if (!appsStatus.app1.estado.lastError) {
        appsStatus.app1.estado = {
          ...appsStatus.app1.estado,
          lastError: fecha.toISOString(),
          lastErrorMessage: err.message
        };
      }
    })
}


consultaMisPagos(); // Consulta inicial

setInterval(consultaMisPagos, INTERVAL);  // Consultas por intervalos

console.log('Prueba iniciada...');

app.get('/status', (req, res) => {
  res.json(appsStatus);
});

app.get('/logs', (req, res) => {
  res.json(logArray);
})

app.get('/toggle-log', (req, res) => {
  logEnable = !logEnable;
  const logStatus = logEnable ? 'Logs habilitados' : 'Logs deshabilitados';
  console.log(`${new Date().toISOString()} - ${logStatus}`);
  res.status(200).send(logStatus);
});

app.listen(PORT, () => console.log(`App running on port ${PORT}...`));