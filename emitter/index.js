const valueReader = require('./valueReader.js');
const EmitterMqttClient = require('./emitterMqttClient')

/**
 * @type {EmitterMqttClient}
 */
var client;

let intervalId;

function startApp(){
    client = new EmitterMqttClient('limerick')
    client.on('restart', function () {
            stopSending();
            startApp();
    });
    startSending();
};

function stopSending(){
    clearInterval(intervalId);
    intervalId = null;
}

function startSending(client){
    intervalId = setInterval(sendLatestValue,1000)
}

function sendLatestValue(){
    const val = valueReader.readValue();
    client.send(val);
    console.log(val);
    failRandomly();
}

function failRandomly(){
    if (Math.random()>0.999){
        console.log('simulating failure');
        stopSending();
    }
}

startApp();