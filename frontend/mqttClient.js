const mqtt = require('mqtt');
const EventEmitter = require('events');

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
        this.#client = mqtt.connect('mqtt://broker.hivemq.com:1883',{
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
         #onMessageReceived(topic, message){
            if (topic.indexOf('emitterValues') === 0){
                const messageObject = JSON.parse(message);
                console.log(`Received value: ${messageObject.value} from site ${messageObject.site}`);
                this.emit('valueReceived', messageObject);
            }
            if (topic.indexOf('emitterStatus') === 0){
                console.log(`Emitter Status: ${topic} : ${message}`);
            }
        }
    
    /**
     * Fired when the client connects.
     * @param {mqtt.MqttClient} client 
     */
    #onConnect(client){
    }

    /**
     * Fired when the client is (not deliberately) disconnected.
     * @param {mqtt.MqttClient} client 
     */
    #onDisconnect(client){
        if (!client.reconnecting) client.reconnect();
    }

};