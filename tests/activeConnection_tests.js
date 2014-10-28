var assert = require("assert"),
    expect = require('expect.js'),
    NmManager = require("../lib/nmManager");

var _defaultConnection = {
    "connection": {
        "id": "dummyConnection",
        "uuid": "8920a029-957d-4da4-9b1a-b5c6c7cbeee2",
        "autoconnect": false,
        "type": "gsm"
    },
    "ppp": {
        "lcp-echo-failure": 3,
        "lcp-echo-interval": 30
    },
    "gsm": {
        "number": "*99#",
        "apn": "plus"
    }
};

function _createConnection(data) {
    if (!data)
        data = _defaultConnection;
    return NmManager.addConnection(data);
}

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

    it('find gsm list', function(done){
        NmManager.getDevices(8)
            .then(function(devices){
                expect(devices).to.be.an(Array);
                expect(devices).to.not.be.empty();
                return done();
            });
    });

})
