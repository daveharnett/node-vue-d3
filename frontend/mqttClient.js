const mqtt = require('mqtt');
const EventEmitter = require('events');

const sitesRepository = require('./sitesRepository.js');

const mqttBrokerUri = process.env.MQTT_HOST || 'mqtt://localhost:1883';


/**
 * Wraps the native mqtt client.
 */
module.exports = class MqttClient extends EventEmitter {

    /** native mqtt client
     * @type {mqtt.MqttClient} 
    */
     #client;
     clientId = 'frontend';
 
     constructor(){
        super();
        this.#client = mqtt.connect(mqttBrokerUri,{
            clientId: this.clientId
        });

        this.#client.on('message',(topic, message)=> this.#onMessageReceived(topic, message.toString()));    


        this.#client.on('connect',()=>{
            this.#onConnect(this.#client); 
            this.emit('connected');
        });
        this.#client.on('disconnect', ()=> this.#onDisconnect(client));    
        
        //listen for incoming commands.
        this.#client.subscribe(`emitterValues/#`);
        this.#client.subscribe(`emitterStatus/#`);
        

    }


    /**
     * Send a restart command to an emitter.
     * @param {string} clientId 
     * @param {string} commandType 
     */
    sendRestartCommand(clientId){
        this.#client.publish(`commands/${clientId}`, commandType);
    }


    /**
     * Handle incoming messages.
     * @param {string} topic 
     * @param {string} message 
     */
    #onMessageReceived = function(topic, message){
        if (topic.startsWith('emitterValues')){
            const messageObject = JSON.parse(message);
            //console.log(`Received value: ${messageObject.value} from site ${messageObject.site}`);
            this.emit('valueReceived', messageObject);
        }
        if (topic.startsWith('emitterStatus')){
            const isUp = message === '1';
            const siteName = topic.substring(topic.indexOf('/') + 1);
            sitesRepository.updateSite(siteName, isUp);
            //console.log(`Emitter Status: ${topic} : ${message}`);
        }
    }
    

    /**
     * Fired when the client connects.
     * @param {mqtt.MqttClient} client 
     */
    #onConnect = function (client){
    }


    /**
     * Fired when the client is (not deliberately) disconnected.
     * @param {mqtt.MqttClient} client 
     */
    #onDisconnect = function(client){
        if (!client.reconnecting) client.reconnect();
    }

};