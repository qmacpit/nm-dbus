var assert = require("assert"),
    expect = require('expect.js'),
    NmManager = require("../lib/nmManager");

describe('modemManager suite', function(){

    it('modem states changes', function(done){

        this.timeout(15000);

        var device3g, connection3g, modemId, activeConnectionId;

        NmManager.getDevices(8)
            .then(function(devices){
                expect(devices).to.be.an(Array);
                expect(devices).to.not.be.empty();
                device3g = devices[0];
                return NmManager.getModems();
            }).then(function(modems){
                expect(modems).to.be.an(Array);
                expect(modems).to.not.be.empty();
                modemId = modems[0];

                NmManager.onModemStateChanged(modemId, function(err, signalData){
//                    console.log(signalData.data)
                    switch (signalData.data) {
                        case 80:
                        case 90:
                            //CONNECTED
                            NmManager.getNetworkInfo(modemId)
                                .then(function(networkInfo){
//                                    console.log(networkInfo);
                                    return NmManager.deactivateConnection(activeConnectionId);
                                })
                                .then(function(){
                                    return done();
                                })
                                .fail(function(err){
                                    console.log(err)
                                });
                            break;
                    }
                });

                return NmManager.getConnections("gsm");
            })
            .then(function(connections){
                expect(connections).to.be.an(Array);
                expect(connections).to.not.be.empty();
                connection3g = connections[0];
                return NmManager.activateConnection(connection3g, device3g);
            })
            .then(function(_activeConnectionId){
                activeConnectionId = _activeConnectionId
                return NmManager.getModemInfo(modemId);
            })
            .then(function(modemInfo){
                expect(modemInfo).to.be.ok();
            })
            .fail(function(err){
                console.log(err);
            })
    });

})
