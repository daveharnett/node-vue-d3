
const { TestWatcher } = require('jest');
const sitesRepository = require('./sitesRepository.js');
const _ = require('underscore');

beforeEach(() => {
    sitesRepository.reset();
});

afterEach(()=>{
    sitesRepository.removeAllListeners();
});
  

test('emits event when new site is added', done =>{
    function callback(eventData){
        expect(eventData['Limerick']).toBe(true);
        done();
    }
    sitesRepository.on(sitesRepository.eventNames.sitesUpdated, callback);
    sitesRepository.updateSite('Limerick', true);
});


test('emits event when site is updated', done =>{
    function callback(eventData){
        expect(eventData['Dublin']).toBe(false);
        done();
    }
    sitesRepository.updateSite('Dublin', true);
    sitesRepository.on(sitesRepository.eventNames.sitesUpdated, callback);
    var result = sitesRepository.updateSite('Dublin', false);
    expect(result['Dublin']).toBe(false);
});


test('does not emit "sitesUpdated" event when value is unchanged', done =>{
    function goodCallback(eventData){
        expect(error).toBeFalsy();
        expect(eventData['Waterford']).toBe(true);
        done();
    };
    function badCallback(eventData){
        error = true;
    };

    let error = false;
    sitesRepository.updateSite('Waterford', true);

    sitesRepository.on(sitesRepository.eventNames.idempotentUpdate, goodCallback);
    sitesRepository.on(sitesRepository.eventNames.sitesUpdated, badCallback);
    
    sitesRepository.updateSite('Waterford', true);

});


test('is a singleton', ()=>{
    const sitesRepository2 = require('./sitesRepository.js');
    const sitesRepository3 = require('./SITESREPOSITORY.js');
    
    sitesRepository.updateSite('Kilkenny', true);
    sitesRepository2.updateSite('Tralee', true);
    sitesRepository3.updateSite('Belfast', true);

    expect(_.toArray(sitesRepository.get()).length).toBe(3);
});