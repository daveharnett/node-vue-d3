const mqtt = require('mqtt');
const EventEmitter = require('events');


module.exports = class EmitterMqttClient extends EventEmitter {
    
    /** native mqtt client
     * @type {mqtt.MqttClient} 
    */
    #client;
    clientId;

    constructor(_clientId){
        super();
        this.clientId = _clientId;
        this.#client = mqtt.connect('mqtt://broker.hivemq.com:1883',{
            clientId: _clientId,
            // register this client as 'down'
            will: {
                topic: `emitterStatus/${_clientId}`,
                payload: '0',
                retain: true,
                qos: 1
            }
        });
        this.#client.on('connect',()=>{
            this.#onConnect(this.#client); 
            this.emit('connect');
        });
        this.#client.on('disconnect', ()=> this.#onDisconnect(client));    
        
        //listen for incoming commands.
        this.#client.subscribe(`commands/${this.clientId}`)
        
        this.#client.on('message',(topic, message)=> this.#onMessageReceived(topic, message.toString()));    

    };

    send(val, callback){
        this.#client.publish(
            `emitterValues/${this.clientId}`, 
            JSON.stringify({
                value: val,
                time: new Date(),
                site: this.clientId
            }), 
            {}, 
            callback);
    };

    /**
     * Handle incoming messages.
     * @param {string} topic 
     * @param {string} message 
     */
    #onMessageReceived = function(topic, message){
        if (topic == `commands/${this.clientId}`){
            console.log(`Command received: ${message}`);
            if (message == 'restart'){
                this.#client.publish(`emitterStatus/${this.clientId}`, '0',{retain:true, qos:1});
                this.#client.end();
                this.#client = null;
                this.emit('restart');    
            }
        }
    }

    /**
     * Fired when the client connects.
     * @param {mqtt.MqttClient} client 
     */
    #onConnect = function(client){
        // register this client as 'up'.
        client.publish(`emitterStatus/${this.clientId}`, '1', {
            retain: true,
            qos: 1
        });
    }

    /**
     * Fired when the client is (not deliberately) disconnected.
     * @param {mqtt.MqttClient} client 
     */
    #onDisconnect = function(client){
        if (!client.reconnecting) client.reconnect();
    }

}


