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

describe('connection suite', function(){

    it('get connections list', function(done){
        NmManager.getConnections(null, function(err, connections){
            expect(err).to.not.be.ok();
            expect(connections).to.be.an(Array);
            expect(connections).to.not.be.empty();
            done();
        });
    });

    it('get connections list - promise call', function(done){
        NmManager.getConnections(null)
            .then(function(connections){
                expect(connections).to.be.an(Array);
                expect(connections).to.not.be.empty();
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
                newConnection = _newConnection;
                return NmManager.getConnection(newConnection);
            })
            .then(function(_newConnection){
                expect(_newConnection.connection).to.eql(_defaultConnection.connection);
                expect(_newConnection.ppp).to.eql(_defaultConnection.ppp);
                expect(_newConnection.gsm).to.eql(_defaultConnection.gsm);
                return NmManager.getConnections();
            })
            .then(function(connections){
                connections2 = connections;
                expect(connections1.length + 1).to.eql(connections2.length);
                return NmManager.deleteConnection(newConnection);
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

    it('update connection', function(done){

        var newConnection, _gsm = {
            "number": "*11#",
            "apn": "play"
        };

        _createConnection()
            .then(function(_newConnection){
                newConnection = _newConnection;
                return NmManager.getConnection(newConnection);
            })
            .then(function(connectionData){
                connectionData.gsm = _gsm;
                return NmManager.updateConnection(newConnection, connectionData);
            })
            .then(function(){
                return NmManager.getConnection(newConnection);
            })
            .then(function(connection){
                expect(connection.connection).to.eql(_defaultConnection.connection);
                expect(connection.ppp).to.eql(_defaultConnection.ppp);
                expect(connection.gsm).to.eql(_gsm);
                return NmManager.deleteConnection(newConnection);
            })
            .then(function(){
                return done();
            })
            .fail(function(err){
                console.log(err);
            })
    });

    it('get gsm connection', function(done){

        var newConnection;

        _createConnection()
            .then(function(_newConnection){
                newConnection = _newConnection;
                return NmManager.getConnections("gsm");
            })
            .then(function(gsmConnections){
                expect(gsmConnections).to.be.an(Array);
                expect(gsmConnections).to.not.be.empty();
                return NmManager.deleteConnection(newConnection);
            })
            .then(function(){
                return done();
            })
    });

})
