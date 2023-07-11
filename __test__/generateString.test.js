const stringGenerator = require('../utilities/generateString');

let expectedLength = 10;

test(`string should be exactly ${expectedLength} long if ${expectedLength} is passed as argument`, ()=>{
    let gottenString = stringGenerator.generateString(expectedLength);
    let gottenLength = gottenString.length;

    expect(gottenLength).toBe(expectedLength);
})

let expectedLength2 = 512;

test(`string should be exactly ${expectedLength2} long if ${expectedLength2} is passed as argument`, ()=>{
    let gottenString = stringGenerator.generateString(expectedLength2);
    let gottenLength = gottenString.length;

    expect(gottenLength).toBe(expectedLength2);
})