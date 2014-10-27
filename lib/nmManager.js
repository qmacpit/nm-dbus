var nmDbus = require("./middleware/nm-dbus");

module.exports = {
    addConnection: function(connectionData, callback){
        return nmDbus.Settings.addConnection(connectionData, callback);
    },
    removeConnection: function(connectionId, callback){
        return nmDbus.Connection.remove(connectionId, callback);
    },
    getConnections: function(type, callback) {
        return nmDbus.Settings.listConnections(callback);
    }
};
