var assert = require("assert"),
    expect = require('expect.js'),
    NmManager = require("../lib/nmManager");

describe('devices suite', function(){

    var deviceId;

    it('get device list', function(done){
        NmManager.getModems()
            .then(function(modems){
                expect(modems).to.be.an(Array);
                expect(modems).to.not.be.empty();
                return NmManager.getModemInfo(modems[0]);
            })
            .then(function(modeminfo){
                return done();
            })
            .fail(function(err){
                console.log(err);
            })
    });

})
