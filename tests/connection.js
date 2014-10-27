var assert = require("assert"),
    expect = require('expect.js'),
    NmManager = require("../lib/nmManager");

describe('connection suite', function(){

    it('get connections list', function(done){
        NmManager.getConnections(null, function(err, connections){
            expect(err).to.not.be.ok();
            expect(connections).to.be.an(Array);
            expect(connections).to.not.be.empty();
            done();
        });
    })

})
