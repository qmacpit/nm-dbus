var assert = require("assert"),
    expect = require('expect.js'),
    NmManager = require("../lib/nmManager");

describe('devices suite', function(){

    var deviceId;

    it('get device list', function(done){
        NmManager.getDevices()
            .then(function(devices){
                expect(devices).to.be.an(Array);
                expect(devices).to.not.be.empty();
                deviceId = devices[0];
            })
            .then(function(){
                return NmManager.getDeviceProperty(deviceId, "Udi");
            })
            .then(function(udi){
                expect(udi).to.be.ok();
                return done();
            })
    });

    //this TC requires an active GSM device recognized by NetworkManager
    it('find gsm list', function(done){
        NmManager.getDevices(8)
            .then(function(devices){
                expect(devices).to.be.an(Array);
                expect(devices).to.not.be.empty();
                return done();
            });
    });

})
