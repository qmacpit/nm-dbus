var assert = require("assert"),
    expect = require('expect.js'),
    NmManager = require("../lib/nmManager");

describe('active connection suite', function(){

    this.timeout(25000);

    var deviceId;

    it('activate gsm connection', function(done){

        var device3g, connection3g, disabled, modemId;

        NmManager.getDevices(8)
            .then(function(devices){
                expect(devices).to.be.an(Array);
                expect(devices).to.not.be.empty();
                device3g = devices[0];
                return NmManager.getModems();
            }).
            then(function(modems){
                expect(modems).to.be.an(Array);
                expect(modems).to.not.be.empty();
                modemId = modems[0];
                return NmManager.getConnections("gsm");
            })
            .then(function(connections){
                expect(connections).to.be.an(Array);
                expect(connections).to.not.be.empty();
                connection3g = connections[0];
                return NmManager.activateConnection(connection3g, device3g);
            })
            .then(function(activeConnectionId){
//                console.log(activeConnectionId)
//                console.log(device3g)
//                console.log(connection3g)


                NmManager.onActiveConnectionStateChanged(activeConnectionId, function(err, signalData){
                    if (disabled) return;
                    expect(err).to.not.be.ok();
                    switch (signalData.data.State) {
                        case "NM_ACTIVE_CONNECTION_STATE_ACTIVATED":
                            NmManager.onModemStateChanged(modemId, function(err, signalData){
                                switch (signalData.data) {
                                    case "DISCONNECTING":
                                        return done();
                                    default:
                                        return;
                                }
                            });
                            NmManager.deactivateConnection(activeConnectionId);
                            break;
                        case "NM_ACTIVE_CONNECTION_STATE_DEACTIVATED":
                            disabled = true;
                    }
                });
            })
            .fail(function(err){
                console.log(err);
            })
    });

})
