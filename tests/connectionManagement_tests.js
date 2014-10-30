var assert = require("assert"),
    expect = require('expect.js'),
    DBusConnector = require("../lib/middleware/dbusConnector"),
    NmManager = require("../lib/nmManager");

var _defaultConnection = {
    "connection": {
        "id": "dummyConnection",
        "uuid": "8920a029-957d-4da4-9b1a-b5c6c7cbade2",
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

    var dbusData = DBusConnector.dbusData();

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

    it('update connection', function(done){

        var newConnection, _gsm = {
                "number": "*11#",
                "apn": "play"
            }, connection = DBusConnector.dbusData("Connection");


        _createConnection()
            .then(function(_newConnection){
                newConnection = _newConnection;
                return NmManager.getConnection(newConnection);
            })
            .then(function(connectionData){
                connectionData.gsm = _gsm;
                NmManager.on(dbusData.NetworkManager.interface, newConnection, connection.interface, "Updated", function(err, data){
                    expect(err).to.be(null);
                    expect(data.object).to.be(newConnection);
                });
                NmManager.on(dbusData.NetworkManager.interface, newConnection, connection.interface, "Removed", function(err, data){
                    expect(err).to.be(null);
                    return done();
                });
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
