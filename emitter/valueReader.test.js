const valueReader = require('./valueReader');

test('all results >= 44', () => {
    var sampleCount = 100000;
    let samples = new Array(sampleCount);

    for(let i=0; i<sampleCount;i++){
        samples[i] = valueReader.readValue();
    }

    var minValue = Math.min(...samples);
    
    expect(minValue).toBeGreaterThanOrEqual(44);
});

test('all results <= 55', () => {
    var sampleCount = 100000;
    let samples = new Array(sampleCount);

    for(let i=0; i<sampleCount;i++){
        samples[i] = valueReader.readValue();
    }

    var maxValue = Math.max(...samples);
    
    expect(maxValue).toBeLessThanOrEqual(55);
});