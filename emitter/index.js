const valueReader = require('./valueReader.js');
const EmitterMqttClient = require('./emitterMqttClient');

/** @type {EmitterMqttClient} */
let client;
let intervalId;

const clientId = process.env.CLIENTID;
console.log(`clientId: ${clientId}`);


function startApp(){
    client = new EmitterMqttClient(clientId);
    client.on('restart', function () {
            stopSending();
            startApp();
    });
    startSending();
};

function stopSending(){
    clearInterval(intervalId);
    intervalId = null;
    client.sendDownStatusMessage();
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
    if (Math.random()>0.99){
        console.log('simulating failure');
        stopSending();
    }
}

startApp();