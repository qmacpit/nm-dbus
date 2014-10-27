var assert = require("assert"),
    expect = require('expect.js'),
    NmManager = require("../lib/nmManager");

function _createConnection(data) {
    if (!data) {
        data = {
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
    }
    return NmManager.addConnection(data);
}

describe('connection suite', function(){

    it('get connections list', function(done){
        NmManager.getConnections(null, function(err, connections){
            expect(err).to.not.be.ok();
            expect(connections).to.be.an(Array);
            expect(connections).to.not.be.empty();
            console.log(connections);
            done();
        });
    });

    it('get connections list - promise call', function(done){
        NmManager.getConnections(null)
            .then(function(connections){
                expect(connections).to.be.an(Array);
                expect(connections).to.not.be.empty();
                console.log(connections);
                return done();
            });
    });

    it('add & delete connection', function(done){

        var connections1, connections1, newConnection;

        NmManager.getConnections(null)
            .then(function(connections){
                connections1 = connections;
            })
            .then(_createConnection)
            .then(function(_newConnection){
                newConnection = _newConnection;return NmManager.getConnections();
            })
            .then(function(connections){
                connections2 = connections;
                expect(connections1.length + 1).to.eql(connections2.length);
                NmManager.deleteConnection(newConnection);
            })
            .then(NmManager.getConnections)
            .then(function(connections){
                expect(connections.length).to.eql(connections.length);
                return done();
            })
            .fail(function(err){
                console.log(err);
            })
    });


})
