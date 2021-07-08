const EventEmitter = require('events');
const _ = require('underscore');

let sites = {};
class SitesRepository extends EventEmitter{
    
    eventNames = {
        sitesUpdated:'sitesUpdated',
        idempotentUpdate: 'idempotentUpdate'
    };

    constructor(){super();}

    /**
     * Update (or add) a site with the given up/down status.
     * @param {string} name 
     * @param {boolean} isUp 
     * @returns the full collection of sites
     */
    updateSite(name, isUp){
        // only emit an update event if a value actually changes.
        if (sites[name] !== isUp){
            sites[name] = isUp;
            let result = this.get();
            this.emit(this.eventNames.sitesUpdated, result);
            console.log(`site ${name} is up? ${isUp}`);
            return result;
        }

        let result = this.get();
        this.emit(this.eventNames.idempotentUpdate, result);
        return result;
    };

    /**
     * Fetch a map of the current sites and whether they are online.
     * @returns {Object.<string, boolean>}
     */
    get(){
        // return a clone so the repo can't be polluted.
        return _.clone(sites);
    }

    /** Clear the repository */
    reset(){
        sites = {};
        return this.get();
    }
}

// export as a singleton.
module.exports = new SitesRepository();