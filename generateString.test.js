const stringGenerator = require('./generateString');

let expectedLength = 10;

test(`string should be exactly ${expectedLength} long if ${expectedLength} is passed as argument`, ()=>{
    let gottenString = stringGenerator.generateString(expectedLength);
    let gottenLength = gottenString.length;

    expect(gottenLength).toBe(expectedLength);
})