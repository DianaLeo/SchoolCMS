//const sum = require('./sum');
function sum(a,b) {
    return a+b
}

//title -h1
describe('sum function',()=>{
    //test cases
    it('should return correct sum of two numbers',()=>{
        //1. setup (initialize - variables, mock)

        //2. execute the function (target)
        const result = sum(1,2);

        //3. compare
        expect(result).toBe(3);//result===3
    });
    //test('',()=>{})

    //title-h2
    describe('another test',()=>{
        //test cases
    })
})