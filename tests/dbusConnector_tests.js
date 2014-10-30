var assert = require("assert"),
    expect = require('expect.js'),
    DBusConnector = require("../lib/middleware/dbusConnector");

describe('DBusConnector suite', function(){

    var data = DBusConnector.dbusData();

    it('no such interface', function(done){

        DBusConnector.callMethod(data.NetworkManager.interface, data.Settings.object, data.Settings.interface + "xxxx", "dummyMethod")
            .fail(function(err){
                expect(err).to.be.ok();
                return done();
            })

    });

    it('no such object', function(done){

        DBusConnector.callMethod(data.NetworkManager.interface, data.Settings.object + "xxxx", data.Settings.interface, "dummyMethod")
            .fail(function(err){
                expect(err).to.be.ok();
                return done();
            })

    });

    it('no such method', function(done){

        var data = DBusConnector.dbusData();

        DBusConnector.callMethod(data.NetworkManager.interface, data.Settings.object, data.Settings.interface, "dummyMethod")
            .fail(function(err){
                expect(err).to.be.ok();
                return done();
            })

    });

    it('no such property', function(done){

        var data = DBusConnector.dbusData();

        DBusConnector.getProperty(data.NetworkManager.interface, data.Settings.object, data.Settings.interface, "xxx")
            .fail(function(err){
                expect(err).to.be.ok();
                return done();
            })

    });

    it('no such signal', function(done){

        var data = DBusConnector.dbusData();

        DBusConnector.on(data.NetworkManager.interface, data.Settings.object + "/0", data.Connection.interface, "xxx", function(err){
            expect(err).to.be.ok();
            return done();
        })
    });

})
