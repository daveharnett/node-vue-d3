const { Server } = require('socket.io');
const MqttClient = require('./mqttClient.js');

module.exports = class EventBroker {
    /** @type Server */
    #io;
    /** @type MqttClient */
    #mqttClient;

    constructor(io, mqttClient){
        this.#io = io;
        this.#mqttClient = mqttClient;


        this.#mqttClient.on('valueReceived', function (message) {
            console.log(`eventbroker message: ${JSON.stringify(message)}`);
            io.emit('valueReceived', message);
        });
        
    }

    


}
