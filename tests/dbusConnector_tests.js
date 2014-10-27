var assert = require("assert"),
    expect = require('expect.js'),
    DBusConnector = require("../lib/middleware/dbusConnector");

describe('DBusConnector suite', function(){

    var data = DBusConnector.dbusData();

    it('no such interface', function(done){

        DBusConnector.callMethod(data.Settings.object, data.Settings.interface + "xxxx", "dummyMethod")
            .fail(function(err){
                expect(err).to.be.ok();
                return done();
            })

    });

    it('no such object', function(done){

        DBusConnector.callMethod(data.Settings.object + "xxxx", data.Settings.interface, "dummyMethod")
            .fail(function(err){
                expect(err).to.be.ok();
                return done();
            })

    });

    it('no such method', function(done){

        var data = DBusConnector.dbusData();

        DBusConnector.callMethod(data.Settings.object, data.Settings.interface, "dummyMethod")
            .fail(function(err){
                expect(err).to.be.ok();
                return done();
            })

    });

})
