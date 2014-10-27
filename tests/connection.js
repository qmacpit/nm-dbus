var assert = require("assert"),
    expect = require('expect.js'),
    NmManager = require("../lib/nmManager");

describe('connection suite', function(){

    it('get connections list', function(done){
        NmManager.getConnections(null, function(err, connections){
            expect(err).to.not.be.ok();
            expect(connections).to.be.an(Array);
            expect(connections).to.not.be.empty();
            console.log(connections);
            done();
        });
    })

    it('get connections list - promise call', function(done){
        NmManager.getConnections(null)
            .then(function(connections){
                expect(connections).to.be.an(Array);
                expect(connections).to.not.be.empty();
                console.log(connections);
                return done();
            });
    })

})
