const { expect,assert, should } = require('chai');
const speeto = require('../factory/speeto')
describe('FactorySpeeto', function () {
  describe('getReward', function () {
    this.timeout(10000)
    it('should getReward properly', function () {
        const model = speeto.createModel()
        speeto.getReward(model)
    });
    it('should have negative ev', function () {
        function simulation(simulationTime, equity){
            let equity_ori = equity
            for(let i=0; i< simulationTime && equity > 9; i++){
                equity -= 9
                const model = speeto.createModel()
                equity += speeto.getReward(model)
            }
            expect(equity).to.be.lessThan(equity_ori)
            console.log(equity/equity_ori)
        }
        // simulation(1000000,5000000)
        simulation(1000000,5000)
        simulation(500,5000)
    })
  });
});
