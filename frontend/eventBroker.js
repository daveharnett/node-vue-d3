const { Server } = require('socket.io');

const MqttClient = require('./mqttClient.js');
const sitesRepository = require('./sitesRepository.js');

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
        
        this.#io.on('connection', (socket) => {
            this.broadcastSiteStates(socket);
            socket.on('resetCommand', (siteName) => {
                this.#mqttClient.sendRestartCommand(siteName);
            });
            
        });

        sitesRepository.on(sitesRepository.eventNames.sitesUpdated, () =>{this.broadcastSiteStates();})
    }

    /**
     * 
     * @param {Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>} socket send to a single socket if profided. broadcast to all if not.
     */
    broadcastSiteStates(socket){
        const sites = sitesRepository.get();
        for (let siteName in sites){
            if (!!socket){
                socket.emit('siteUpdate', {name: siteName, isUp: sites[siteName]} );
            } else {
                this.#io.emit('siteUpdate', {name: siteName, isUp: sites[siteName]} );
            }
        }

    }


}
