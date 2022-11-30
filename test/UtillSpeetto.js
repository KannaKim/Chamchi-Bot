const { expect,assert, should } = require('chai');
const casino = require('../utill/casino')
describe('UtillSpeeto', function () {
  describe('createRow', function () {
    it('should create row of n random', function () {
      function createRowTest(n,size){
        let a = casino.createRow(n, 2, 20, size)
        expect(a["row"].length).to.equal(size)
      }
      createRowTest(3,7)
      createRowTest(4,6)
      createRowTest(5,8)
    });
    it('should be near expected probability', function(){
      function probCheck(expectedProb, duplicateN, rowRange, size, iteration, precision){
        let numOfTrue = 0;
        for(let i=0; i< iteration; i++){
          let arr = casino.createRow(rowRange, duplicateN, 20, size)
          if(casino.nDuplicateExist(duplicateN, arr["row"])){
            numOfTrue +=1
          }
        }
        let elipson = Math.pow(10,precision)
        let cumulativeProb = Math.round(numOfTrue/iteration*elipson)/elipson
        console.log(cumulativeProb)
        expect(cumulativeProb).to.equal(expectedProb)
      }
      this.timeout(1000000)
      probCheck(0.5, 2, 2, 2, 50000000, 2)
      probCheck(0.34, 2, 8, 3, 50000000, 2)
      probCheck(0.1, 2, 58, 4, 50000000, 2)
      probCheck(0.01, 3, 30, 5, 50000000, 2)
      probCheck(0.0001, 4, 52, 6, 50000000, 5)

    })
  });

  describe('nDuplicateExist', function () {
    it('should detect n duplicate', function () {
      function detectNDuplicate(n, arr){
        expect(casino.nDuplicateExist(n,arr)).to.equal(true)
      }
      detectNDuplicate(2,[1,1,2,3,4,5,6])
      detectNDuplicate(2,[1,1,1,2,3,4,5,6])
      detectNDuplicate(3,[1,2,2,2,3,4,5,6])
      detectNDuplicate(4,[1,2,6,6,3,4,6,5,6,1])
    });
    it('should not detect n duplicate', function () {
      function detectNDuplicate(n, arr){
        expect(casino.nDuplicateExist(n,arr)).to.not.equal(true)
      }
      detectNDuplicate(3,[1,1,2,3,4,5,6])
      detectNDuplicate(4,[1,2,2,3,4,5,6])
      detectNDuplicate(5,[1,2,3,4,5,6,1])
    });
  });
});